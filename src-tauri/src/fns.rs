#![allow(deprecated)]

use std::{cell::RefCell, ffi::CString};

use tauri::{AppHandle, Emitter, Listener, Manager, WebviewWindow};
use tauri_nspanel::{
    block::ConcreteBlock,
    cocoa::{
        appkit::{
            NSMainMenuWindowLevel, NSView, NSViewHeightSizable, NSViewWidthSizable,
            NSVisualEffectBlendingMode, NSVisualEffectMaterial, NSVisualEffectState, NSWindow,
            NSWindowCollectionBehavior, NSWindowOrderingMode,
        },
        base::{id, nil},
        foundation::{NSPoint, NSRect},
    },
    objc::{
        class, msg_send,
        rc::StrongPtr,
        runtime::{Class, BOOL, NO, YES},
        sel, sel_impl,
    },
    panel_delegate, ManagerExt, WebviewWindowExt,
};

#[allow(non_upper_case_globals)]
const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;

const LIQUID_CORNER_RADIUS: f64 = 18.0;
const GLASS_TINT_ALPHA: f64 = 0.18;

thread_local! {
    static GLASS_VIEW: RefCell<Option<StrongPtr>> = RefCell::new(None);
    static BACKGROUND_VIEW: RefCell<Option<StrongPtr>> = RefCell::new(None);
}

pub fn swizzle_to_menubar_panel(app_handle: &tauri::AppHandle) {
    let panel_delegate = panel_delegate!(SpotlightPanelDelegate {
        window_did_resign_key
    });

    let window = app_handle.get_webview_window("main").unwrap();

    let panel = window.to_panel().unwrap();

    let handle = app_handle.clone();

    panel_delegate.set_listener(Box::new(move |delegate_name: String| {
        if delegate_name.as_str() == "window_did_resign_key" {
            let _ = handle.emit("menubar_panel_did_resign_key", ());
        }
    }));

    panel.set_level(NSMainMenuWindowLevel + 1);

    panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);

    panel.set_collection_behaviour(
        NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
    );

    panel.set_delegate(panel_delegate);
}

pub fn setup_menubar_panel_listeners(app_handle: &AppHandle) {
    fn hide_menubar_panel(app_handle: &tauri::AppHandle) {
        if check_menubar_frontmost() {
            return;
        }

        let panel = app_handle.get_webview_panel("main").unwrap();

        panel.order_out(None);
    }

    let handle = app_handle.clone();

    app_handle.listen_any("menubar_panel_did_resign_key", move |_| {
        hide_menubar_panel(&handle);
    });

    let handle = app_handle.clone();

    let callback = Box::new(move || {
        hide_menubar_panel(&handle);
    });

    register_workspace_listener(
        "NSWorkspaceDidActivateApplicationNotification".into(),
        callback.clone(),
    );

    register_workspace_listener(
        "NSWorkspaceActiveSpaceDidChangeNotification".into(),
        callback,
    );
}

pub fn update_menubar_appearance(app_handle: &AppHandle) {
    let window = app_handle.get_webview_window("main").unwrap();

    apply_liquid_glass(&window, LIQUID_CORNER_RADIUS);
    set_corner_radius(&window, LIQUID_CORNER_RADIUS);
}

pub fn set_corner_radius(window: &WebviewWindow, radius: f64) {
    let win: id = window.ns_window().unwrap() as _;

    unsafe {
        let view: id = win.contentView();

        view.setWantsLayer(YES);

        let layer: id = view.layer();

        let _: () = msg_send![layer, setCornerRadius: radius];
        let _: () = msg_send![layer, setMasksToBounds: YES];
        let clear: id = msg_send![class!(NSColor), clearColor];
        let clear_color: id = msg_send![clear, CGColor];
        let _: () = msg_send![layer, setBackgroundColor: clear_color];
    }
}

fn apply_liquid_glass(window: &WebviewWindow, corner_radius: f64) {
    unsafe {
        let Ok(raw_handle) = window.ns_window() else {
            return;
        };

        let ns_window: id = raw_handle as _;
        let container: id = ns_window.contentView();
        let bounds: NSRect = msg_send![container, bounds];
        let mask = NSViewWidthSizable | NSViewHeightSizable;

        BACKGROUND_VIEW.with(|slot| {
            if let Some(existing) = slot.borrow_mut().take() {
                let view: id = *existing;
                let _: () = msg_send![view, removeFromSuperview];
            }
        });

        GLASS_VIEW.with(|slot| {
            if let Some(existing) = slot.borrow_mut().take() {
                let view: id = *existing;
                let _: () = msg_send![view, removeFromSuperview];
            }
        });

        if let Some(glass_cls) = Class::get("NSGlassEffectView") {
            let glass_alloc: id = msg_send![glass_cls, alloc];
            let glass: id = msg_send![glass_alloc, initWithFrame: bounds];

            let _: () = msg_send![glass, setAutoresizingMask: mask];
            let _: () = msg_send![glass, setWantsLayer: YES];
            let glass_layer: id = msg_send![glass, layer];
            let _: () = msg_send![glass_layer, setCornerRadius: corner_radius];
            let _: () = msg_send![glass_layer, setMasksToBounds: YES];

            let background_alloc: id = msg_send![class!(NSView), alloc];
            let background_view: id = msg_send![background_alloc, initWithFrame: bounds];
            let _: () = msg_send![background_view, setAutoresizingMask: mask];
            let _: () = msg_send![background_view, setWantsLayer: YES];
            let background_layer: id = msg_send![background_view, layer];
            let palette: id = msg_send![class!(NSColor), windowBackgroundColor];
            let palette: id = msg_send![palette, colorWithAlphaComponent: 0.72];
            let palette_color: id = msg_send![palette, CGColor];
            let _: () = msg_send![background_layer, setBackgroundColor: palette_color];
            let _: () = msg_send![background_layer, setCornerRadius: corner_radius];
            let _: () = msg_send![background_layer, setMasksToBounds: YES];

            let _: () = msg_send![
                container,
                addSubview: background_view
                positioned: NSWindowOrderingMode::NSWindowBelow
                relativeTo: nil
            ];

            let tint_selector = sel!(setTintColor:);
            let supports_tint: BOOL = msg_send![glass, respondsToSelector: tint_selector];
            if supports_tint == YES {
                let accent: id = msg_send![class!(NSColor), controlAccentColor];
                let accent: id = msg_send![accent, colorWithAlphaComponent: GLASS_TINT_ALPHA];
                let _: () = msg_send![glass, setTintColor: accent];
            }

            let _: () = msg_send![
                container,
                addSubview: glass
                positioned: NSWindowOrderingMode::NSWindowAbove
                relativeTo: background_view
            ];

            BACKGROUND_VIEW.with(|slot| {
                *slot.borrow_mut() = Some(StrongPtr::new(background_view as _));
            });

            GLASS_VIEW.with(|slot| {
                *slot.borrow_mut() = Some(StrongPtr::new(glass as _));
            });
        } else {
            let visual_alloc: id = msg_send![class!(NSVisualEffectView), alloc];
            let glass: id = msg_send![visual_alloc, initWithFrame: bounds];
            let _: () = msg_send![glass, setMaterial: NSVisualEffectMaterial::WindowBackground];
            let _: () = msg_send![glass, setBlendingMode: NSVisualEffectBlendingMode::BehindWindow];
            let _: () = msg_send![glass, setState: NSVisualEffectState::Active];
            let _: () = msg_send![glass, setAutoresizingMask: mask];
            let _: () = msg_send![glass, setWantsLayer: YES];
            let layer: id = msg_send![glass, layer];
            let _: () = msg_send![layer, setCornerRadius: corner_radius];
            let _: () = msg_send![layer, setMasksToBounds: YES];
            let _: () = msg_send![
                container,
                addSubview: glass
                positioned: NSWindowOrderingMode::NSWindowBelow
                relativeTo: nil
            ];

            GLASS_VIEW.with(|slot| {
                *slot.borrow_mut() = Some(StrongPtr::new(glass as _));
            });
            BACKGROUND_VIEW.with(|slot| {
                slot.borrow_mut().take();
            });
        }

        let _: () = msg_send![container, setWantsLayer: YES];
        let container_layer: id = msg_send![container, layer];
        let _: () = msg_send![container_layer, setCornerRadius: corner_radius];
        let _: () = msg_send![container_layer, setMasksToBounds: YES];
        let clear: id = msg_send![class!(NSColor), clearColor];
        let clear_color: id = msg_send![clear, CGColor];
        let _: () = msg_send![container_layer, setBackgroundColor: clear_color];
    }
}

pub fn position_menubar_panel(app_handle: &tauri::AppHandle, padding_top: f64) {
    let window = app_handle.get_webview_window("main").unwrap();

    let monitor = monitor::get_monitor_with_cursor().unwrap();

    let scale_factor = monitor.scale_factor();

    let visible_area = monitor.visible_area();

    let monitor_pos = visible_area.position().to_logical::<f64>(scale_factor);

    let monitor_size = visible_area.size().to_logical::<f64>(scale_factor);

    let mouse_location: NSPoint = unsafe { msg_send![class!(NSEvent), mouseLocation] };

    let handle: id = window.ns_window().unwrap() as _;

    let mut win_frame: NSRect = unsafe { msg_send![handle, frame] };

    win_frame.origin.y = (monitor_pos.y + monitor_size.height) - win_frame.size.height;

    win_frame.origin.y -= padding_top;

    win_frame.origin.x = {
        let top_right = mouse_location.x + (win_frame.size.width / 2.0);

        let is_offscreen = top_right > monitor_pos.x + monitor_size.width;

        if !is_offscreen {
            mouse_location.x - (win_frame.size.width / 2.0)
        } else {
            let diff = top_right - (monitor_pos.x + monitor_size.width);

            mouse_location.x - (win_frame.size.width / 2.0) - diff
        }
    };

    let _: () = unsafe { msg_send![handle, setFrame: win_frame display: NO] };
}

fn register_workspace_listener(name: String, callback: Box<dyn Fn()>) {
    let workspace: id = unsafe { msg_send![class!(NSWorkspace), sharedWorkspace] };

    let notification_center: id = unsafe { msg_send![workspace, notificationCenter] };

    let block = ConcreteBlock::new(move |_notif: id| {
        callback();
    });

    let block = block.copy();

    let name: id =
        unsafe { msg_send![class!(NSString), stringWithCString: CString::new(name).unwrap()] };

    unsafe {
        let _: () = msg_send![
            notification_center,
            addObserverForName: name object: nil queue: nil usingBlock: block
        ];
    }
}

fn app_pid() -> i32 {
    let process_info: id = unsafe { msg_send![class!(NSProcessInfo), processInfo] };

    let pid: i32 = unsafe { msg_send![process_info, processIdentifier] };

    pid
}

fn get_frontmost_app_pid() -> i32 {
    let workspace: id = unsafe { msg_send![class!(NSWorkspace), sharedWorkspace] };

    let frontmost_application: id = unsafe { msg_send![workspace, frontmostApplication] };

    let pid: i32 = unsafe { msg_send![frontmost_application, processIdentifier] };

    pid
}

pub fn check_menubar_frontmost() -> bool {
    get_frontmost_app_pid() == app_pid()
}
