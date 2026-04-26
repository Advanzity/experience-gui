import { Experience, Elements, Actions, Switch, Layout } from './lib/Experience';
import HomeIcon from '../assets/images/N_home.png';
import HomeInactiveIcon from '../assets/images/N_home_ia.png';
import ActionsIcon from '../assets/images/N_edit.png';
import ActionsInactiveIcon from '../assets/images/N_edit_ia.png';
import StoreIcon from '../assets/images/N_store.png';
import StoreInactiveIcon from '../assets/images/N_store_ia.png';
import TerminalIcon from '../assets/images/N_terminal.png';

var experience = new Experience();

experience.Authenticate(async (username: string, password: string) =>
{
    experience.UserID = username || "local-user";
    experience.Username = username || "Guest";
    experience.Password = password;
    experience.Tag = "#0001";
    experience.Role = "Local";
    experience.Friends = "0";
    experience.Servers = "0";
    experience.Prefix = "!";
    experience.OwnedPlugins = "0";

    var home = experience.AddMenuItem(Layout.Flex, "Home", HomeIcon, HomeInactiveIcon, () => { console.log(`Home was clicked.`); });
    var actions = experience.AddMenuItem(Layout.Flex, "Actions", ActionsIcon, ActionsInactiveIcon, () => { console.log(`Actions was clicked.`); });
    var store = experience.AddMenuItem(Layout.Flex, "Store", StoreIcon, StoreInactiveIcon, () => { console.log(`Store was clicked.`) });
    var terminal = experience.AddMenuItem(Layout.Flex, "Terminal", TerminalIcon, TerminalIcon, () => { console.log(`Terminal was clicked.`); });

    experience.AddElement(home, Elements.Announcement, "Announcement!", "This is an examplery announcement - david");

    experience.AddElement(actions, Elements.Title, "Autofarm");
    experience.AddAction(actions, Actions.Button, "Button", "A button that can be clicked..", "Click", () => { experience.CreatePopup("Hello", "World")  });
    experience.AddAction(actions, Actions.TextField, "TextField", "A text field that can hold a value..", "Example Text..", (var1: string) => { console.log(`TextField got value '${var1}'.`); });
    experience.AddAction(actions, Actions.Slider, "Slider", "A slider with a 0-100 range..", 24, (var1: number) => { console.log(`Slider got value '${var1.toString()}'.`); });
    experience.AddElement(actions, Elements.Title, "Commands");
    experience.AddAction(actions, Actions.ColorPicker, "ColorPicker", "A QColorDialog to select a certain color..", "#a1a1a1", (var1: string) => { console.log(`ColorPicker got value '${var1.toString()}'.`); });
    experience.AddAction(actions, Actions.Switch, "Switch", "A switch that can be enabled or disabled..", Switch.Enabled, (var1: boolean) => { console.log(`Switch got value '${var1.toString()}'.`); });

    experience.AddElement(store, Elements.StoreItem,  "Example 1", "This is a plugin. It can do anything from add commands to change the entire theme of Experience to add new automated actions to the self bot. They are very versitile and the limits are endless..");
    //experience.AddElement(store, Elements.StoreItem,  "Example 2", "This is a plugin. It can do anything from add commands to change the entire theme of Experience to add new automated actions to the self bot. They are very versitile and the limits are endless..");

    experience.AddElement(terminal, Elements.Terminal);

    experience.Show();
});
