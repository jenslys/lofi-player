use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle,
};
use tauri_nspanel::ManagerExt;

use crate::fns::position_menubar_panel;

pub fn create(app_handle: &AppHandle) -> tauri::Result<TrayIcon> {
    let icon = Image::from_bytes(include_bytes!("../icons/cup-outline.png"))?;

    // Create context menu with Quit option
    let quit_item = MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app_handle, &[&quit_item])?;

    TrayIconBuilder::with_id("tray")
        .icon(icon)
        .icon_as_template(true)
        .menu(&menu)
        .show_menu_on_left_click(false) // Disable menu on left-click
        .on_menu_event(|app_handle, event| {
            // Handle menu events (right-click context menu)
            if event.id() == "quit" {
                app_handle.exit(0);
            }
        })
        .on_tray_icon_event(|tray, event| {
            let app_handle = tray.app_handle();

            // Handle tray icon events (left-click)
            if let TrayIconEvent::Click { button, button_state, .. } = event {
                if button == MouseButton::Left && button_state == MouseButtonState::Up {
                    let panel = app_handle.get_webview_panel("main").unwrap();

                    if panel.is_visible() {
                        panel.order_out(None);
                        return;
                    }

                    position_menubar_panel(app_handle, 0.0);

                    panel.show();
                }
            }
        })
        .build(app_handle)
}

#[tauri::command]
pub fn update_tray_icon(app_handle: AppHandle, is_playing: bool) -> tauri::Result<()> {
    let tray = app_handle.tray_by_id("tray").unwrap();
    
    let icon = if is_playing {
        Image::from_bytes(include_bytes!("../icons/cup-bold.png"))?
    } else {
        Image::from_bytes(include_bytes!("../icons/cup-outline.png"))?
    };
    
    tray.set_icon(Some(icon))?;
    
    Ok(())
}
