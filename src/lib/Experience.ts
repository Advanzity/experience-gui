/*

  ███████╗██╗  ██╗██████╗ ███████╗██████╗ ██╗███████╗███╗   ██╗ ██████╗███████╗
  ██╔════╝╚██╗██╔╝██╔══██╗██╔════╝██╔══██╗██║██╔════╝████╗  ██║██╔════╝██╔════╝
  █████╗   ╚███╔╝ ██████╔╝█████╗  ██████╔╝██║█████╗  ██╔██╗ ██║██║     █████╗
  ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══╝  ██║╚██╗██║██║     ██╔══╝
  ███████╗██╔╝ ██╗██║     ███████╗██║  ██║██║███████╗██║ ╚████║╚██████╗███████╗
  ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝

*/

/*

 — Libraries:
   — NodeGUI by a7ul

 — Fonts:
   — Consolas by Lucas de Groot
   — Proxima by Mark Simonson

*/

import { QMainWindow, QWidget, FlexLayout, QPushButton, QFontDatabase, QFont, QFontWeight, CursorShape, QIcon, QLabel, QLineEdit, QSlider, Orientation, QScrollArea, ScrollBarPolicy, QBoxLayout, WindowType, WidgetAttribute, EchoMode, WindowState, WidgetEventTypes, QMouseEvent, QColorDialog, QGraphicsBlurEffect, QCheckBox, QSize, AlignmentFlag, QTextEdit, QGridLayout, QKeyEvent, Key } from '@nodegui/nodegui';

import { SmartLogger } from './SmartLogger';
import { Cryptography } from './Cryptography';

import Logo from '../../assets/images/logo.png';
import Exit from '../../assets/images/exit.png';
import ExitStore from '../../assets/images/exit_store.png';
import Minimize from '../../assets/images/minimize.png';
import ProfileImage from '../../assets/images/user.png';
import AdvertisementImage from '../../assets/images/advertisement.png';
import PluginImage from '../../assets/images/plugin.png';
import SwitchUncheckedImage from '../../assets/images/switch_unchecked.png';
import SwitchCheckedImage from '../../assets/images/switch_checked.png';

import { exit } from 'process';
import { QInputEvent } from '@nodegui/nodegui/dist/lib/QtGui/QEvent/QInputEvent';
const path = require('path');
const AssetRoot = path.resolve(__dirname, '../assets');
const Asset = (...parts: string[]) => path.join(AssetRoot, ...parts).split('\\').join('/');
const ProximaFont = Asset('fonts', 'Proxima.ttf');
const ProximaBoldFont = Asset('fonts', 'ProximaBold.ttf');
const ConsolasFont = Asset('fonts', 'Consolas.ttf');

export enum Level {
  Debug = 0,
  Alert = 1,
  Error = 2,
  Fatal = 3
}

export enum Switch {
  Enabled = 1,
  Disabled = 0
}

export enum Actions {
  Button,
  TextField,
  Slider,
  ColorPicker,
  Switch
}

export enum Elements {
  Announcement,
  Terminal,
  StoreItem,
  Title
}

export enum Layout {
  Flex = 0,
  Grid = 1,
  Box = 2
}

export class Experience {

  public Version = "1.0.0";

  public Uptime = "1 day";
  public ServerVersion = "1.0.0";

  public UserID = "";
  public Username = "";
  public Password = "";
  public Tag = "";
  public Role = "";
  public Friends = "";
  public Servers = "";
  public Prefix = "";
  public OwnedPlugins = "";

  private HasSetup = false;
  private HasPopup = false;
  private HasTerminal = false;
  private ViewingStoreItem = false;
  private X = 0;
  private Y = 0;
  private Crypto = new Cryptography();
  private Logger = new SmartLogger();
  private Window = new QMainWindow();  // Window
  private Core = new QWidget();        // Core Content
  private Menu = new QWidget();        // Menu Content
  private Profile = new QWidget();     // Profile Content
  private Information = new QWidget(); // Information Content
  private Advertising = new QWidget(); // Advertising Content
  private Dragger = new QWidget();     // Window Dragger
  private CoreRoot = new FlexLayout();
  private MenuRoot = new FlexLayout();
  private ProfileRoot = new FlexLayout();
  private InformationRoot = new FlexLayout();
  private AdvertisingRoot = new FlexLayout();
  private DraggerRoot = new FlexLayout();
  private Overlay = new QWidget();
  private OverlayEffect = new QGraphicsBlurEffect();
  private PublicLogger = new QTextEdit();
  private BoldFont = new QFont();      // Bold Font
  private MediumFont = new QFont();    // Regular Font
  private ConsoleFont = new QFont();   // Console Font
  private MenuItems = 0;               // Number of Menus
  private _Menus: any =                // Collection of Menu Objects
  {
    Root: [],
    Widget: [],
    ScrollArea: [],
    Actions: [],
    Buttons: [],
    Active_Icons: [],
    Inactive_Icons: [],
    Labels: []
  };

  private CachedCommands = Array();
  private CachedCommandIndex = 0;

  private UsernameLabel = new QLabel();
  private FriendsLabel = new QLabel();
  private ServerLabel = new QLabel();
  private PrefixLabel = new QLabel();
  private UptimeLabel = new QLabel();
  private ProfilePicture = new QPushButton();

  constructor() {
    this.Logger.createDebug(`Setting up window..`);

    this.Window.setAttribute(WidgetAttribute.WA_TranslucentBackground, true);
    this.Window.setWindowFlag(WindowType.FramelessWindowHint, true);
    this.Window.setWindowTitle("Experience");
    this.Window.setWindowIcon(new QIcon(Logo));

    this.Core.setObjectName("core");
    this.Core.setLayout(this.CoreRoot);

    this.Menu.setObjectName("menu");
    this.Menu.setLayout(this.MenuRoot);

    this.Profile.setObjectName("profile");
    this.Profile.setLayout(this.ProfileRoot);

    this.Information.setObjectName("information");
    this.Information.setLayout(this.InformationRoot);

    this.Advertising.setObjectName("advertising");
    this.Advertising.setLayout(this.AdvertisingRoot);

    this.Dragger.setObjectName("dragger");
    this.Dragger.setLayout(this.DraggerRoot);

    this.CoreRoot.addWidget(this.Menu);
    this.CoreRoot.addWidget(this.Profile);
    this.CoreRoot.addWidget(this.Information);
    this.CoreRoot.addWidget(this.Advertising);
    this.CoreRoot.addWidget(this.Dragger);

    this.Logger.createDebug(`Setting up fonts..`);

    QFontDatabase.addApplicationFont(ProximaFont);
    QFontDatabase.addApplicationFont(ProximaBoldFont);
    QFontDatabase.addApplicationFont(ConsolasFont);

    this.BoldFont.setFamily("Proxima Nova Rg");
    this.BoldFont.setBold(true);
    this.BoldFont.setWeight(QFontWeight.Bold);

    this.MediumFont.setFamily("Proxima Nova Rg");
    this.MediumFont.setWeight(QFontWeight.Medium);

    this.ConsoleFont.setFamily("Consolas");
    this.ConsoleFont.setWeight(QFontWeight.Medium);

    this.Logger.createDebug(`Setting up styling..`);

    this.Window.setFixedSize(1000, 600);
    this.Window.setCentralWidget(this.Core);
    this.Window.addEventListener(WidgetEventTypes.MouseButtonPress, (nativeEvt: any) => {
      if (!this.HasPopup && this.Dragger.underMouse()) {
        const mouseEvt = new QMouseEvent(nativeEvt);
        this.X = mouseEvt.x();
        this.Y = mouseEvt.y();
      }
    });
    this.Window.addEventListener(WidgetEventTypes.MouseMove, (nativeEvt: any) => {
      if (!this.HasPopup && this.Dragger.underMouse()) {
        const mouseEvt = new QMouseEvent(nativeEvt);
        this.Window.move(mouseEvt.globalX() - this.X, mouseEvt.globalY() - this.Y);
      }
    });
    this.Window.setStyleSheet(
      `
        QCheckBox::indicator:unchecked {
          image: url("${SwitchUncheckedImage}");
        }

        QCheckBox::indicator:checked {
          image: url("${SwitchCheckedImage}");
        }

        #core {
          background-color: #171717;
        }

        #menu {
          background-color: #1e1e1e;
          height: '550px';
          width: '200px';
          position: absolute;
          left: '10px';
          top: '40px';
          border-radius: '10px';
        }
        #profile {
          background-color: #1e1e1e;
          height: '220px';
          width: '160px';
          position: absolute;
          left: '830px';
          top: '40px';
          border-radius: '10px';
        }
        #information {
          background-color: #1e1e1e;
          height: '120px';
          width: '160px';
          position: absolute;
          left: '830px';
          top: '270px';
          border-radius: '10px';
        }
        #advertising {
          background-color: #1e1e1e;
          height: '190px';
          width: '160px';
          position: absolute;
          left: '830px';
          top: '400px';
          border-radius: '10px';
        }
        #storeitem {
          background-color: #232323;
          height: '540px';
          width: '580px';
          position: absolute;
          left: '230px';
          top: '50px';
          border-top-left-radius: "10px";
          border-top-right-radius: "10px";
        }
        #dragger {
          height: '40px';
          width: '1000px';
          position: absolute;
          left: '0px';
          top: '0px';
        }

        #overlay {
          background-color: rgba(18, 18, 18, 150);
          height: '600px';
          width: '1000px';
          position: absolute;
          left: '0px';
          top: '0px';
          border-style: solid;
          border-color: #262626;
          border-width: '1px';
        }







        #exit {
          background-color: #171717;
          height: '30px';
          width: '30px';
          position: absolute;
          left: '960px';
          top: '5px';
          border-style: solid;
          border-color: #171717;
          border-width: '0px';
        }

        #minimize {
          background-color: #171717;
          height: '30px';
          width: '30px';
          position: absolute;
          left: '920px';
          top: '5px';
          border-style: solid;
          border-color: #171717;
          border-width: '0px';
        }






        #profileimage {
          height: '48px';
          width: '48px';
          position: absolute;
          left: '59px';
          top: '20px';
          border-radius: '24px';
        }

        #profilelabel {
          font-size: 16px;
          color: #9c9c9c;
          height: '20px';
          width: '160px';
          position: absolute;
          left: '0px';
          top: '72px';
        }

        #profileinfolabel {
          font-size: 16px;
          color: #9c9c9c;
          height: '20px';
          position: absolute;
          left: '0px';
          top: '110px';
        }




        #informationlabel {
          font-size: 14px;
          color: #9c9c9c;
          height: '20px';
          position: absolute;
          left: '20px';
          top: '10px';
        }
        #statusbar {
          background-color: #222222;
          color: #ffffff;
          border-radius: '10px';
          left: '25px';
          top: '10px';
          width: '100px';
          height: '20px';
        }
        #statusbar:chunk {
          background-color: #ffffff;
          border-top-left-radius: '10px';
          border-bottom-left-radius: '10px';
        }





        #menulabel {
          font-size: 16px;
          color: #9c9c9c;
          position: absolute;
          left: '60px';
          top: '20px';
        }
        #menulabel:hover {
          color: #c7c7c7;
        }

        #menubutton {
          width: '30px';
          height: '30px';
          background-color: rgba(0, 0, 0, 0);
          position: absolute;
          left: '20px';
          top: '20px';
        }

        #menuholder {
          height: '550px';
          width: '600px';
          border-radius: '10px';
        }

        #menuscroll {
          background-color: #1e1e1e;
          height: '550px';
          width: '600px';
          position: absolute;
          left: '220px';
          top: '40px';
          border-radius: '10px';
        }

        #actionholder {
          background-color: #222222;
          height: '60px';
          width: '584px';
          border-radius: '10px';
          margin-left: '5px';
          margin-top: '5px';
          border-style: solid;
          border-color: #262626;
          border-width: '1px';
        }

        #titletemplate {
          color: #ffffff;
          font-size: 13px;
          position: absolute;
          left: '25px';
          top: '17px';
        }

        #descriptiontemplate {
          color: #9c9c9c;
          font-size: 12px;
          position: absolute;
          left: '25px';
          top: '35px';
        }

        #switchtemplate {
          height: '40px';
          width: '50px';
          position: absolute;
          left: '530px';
          top: '12px';
        }

        #buttontemplate {
          background-color: #292929;
          color: #9c9c9c;
          font-size: '14px';
          height: '30px';
          width: '90px';
          border-radius: '10px';
          position: absolute;
          left: '480px';
          top: '19px';
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
        }
        #buttontemplate:hover {
          background-color: #303030;
          color: #c7c7c7;
        }

        #textfieldtemplate {
          background-color: #292929;
          color: #9c9c9c;
          font-size: '14px';
          height: '30px';
          width: '150px';
          border-radius: '10px';
          position: absolute;
          left: '420px';
          top: '19px';
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
        }

        #announcementtemplate {
          position: absolute;
          left: '25px';
          top: '23px';

          height: '20px';
          width: '20px';

          background-color: #ffffff;
          border-radius: '10px';
        }

        #slidertemplate {
          position: absolute;
          left: '420px';
          top: '22px';

          height: '20px';
          width: '150px';
        }
        QSlider::groove:horizontal {
          height: 10px;
          background: #292929;
          margin: 0px;
          border-radius: 4px;
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
        }
        QSlider::handle:horizontal {
          background: #ffffff;
          width: 24px;
          height: 8px;
          border-radius: 4px;
        }

        QScrollArea {
          background-color: #1e1e1e;
          border-radius: '10px';
        }
      `
    );

    this.OverlayEffect.setBlurRadius(5);

    this.Overlay = new QWidget();
    this.Overlay.setObjectName("overlay");
    this.Overlay.setGraphicsEffect(this.OverlayEffect);

    this.ConsoleFont.setBold(true);
    const title_label = new QLabel();
    title_label.setText("EXPERIENCE");
    title_label.setFont(this.ConsoleFont);
    title_label.setObjectName("informationlabel");
    title_label.setInlineStyle(`top: "10px"; left: "18px"; font-size: 13px;`);
    this.ConsoleFont.setBold(false);

    const exit = new QPushButton();
    exit.setIcon(new QIcon(Exit));
    exit.setObjectName("exit");
    exit.setCursor(CursorShape.PointingHandCursor);
    exit.addEventListener('clicked', () => { process.exit(1); });

    const minimize = new QPushButton();
    minimize.setIcon(new QIcon(Minimize));
    minimize.setObjectName("minimize");
    minimize.setCursor(CursorShape.PointingHandCursor);
    minimize.addEventListener('clicked', () => { this.Window.setWindowState(WindowState.WindowMinimized); });



    this.ProfilePicture = new QPushButton();
    this.ProfilePicture.setObjectName("profileimage");
    this.ProfilePicture.setCursor(CursorShape.ArrowCursor);

    this.UsernameLabel = new QLabel();
    this.UsernameLabel.setText(this.Username);
    this.UsernameLabel.setFont(this.BoldFont);
    this.UsernameLabel.setAlignment(AlignmentFlag.AlignCenter);
    this.UsernameLabel.setObjectName("profilelabel");

    const friends_label = new QLabel();
    friends_label.setText("Friends");
    friends_label.setFont(this.BoldFont);
    friends_label.setObjectName("profileinfolabel");
    friends_label.setInlineStyle(`font-size: 14px; left: "20px";`);

    this.FriendsLabel = new QLabel();
    this.FriendsLabel.setText(this.Friends);
    this.FriendsLabel.setFont(this.MediumFont);
    this.FriendsLabel.setAlignment(AlignmentFlag.AlignRight);
    this.FriendsLabel.setObjectName("profileinfolabel");
    this.FriendsLabel.setInlineStyle(`font-size: 14px; left: "110px"; top: "113px"; width: "30px";`);

    const servers_label = new QLabel();
    servers_label.setText("Servers");
    servers_label.setFont(this.BoldFont);
    servers_label.setObjectName("profileinfolabel");
    servers_label.setInlineStyle(`font-size: 14px; left: "20px"; top: "135px";`);

    this.ServerLabel = new QLabel();
    this.ServerLabel.setText(this.Servers);
    this.ServerLabel.setFont(this.MediumFont);
    this.ServerLabel.setAlignment(AlignmentFlag.AlignRight);
    this.ServerLabel.setObjectName("profileinfolabel");
    this.ServerLabel.setInlineStyle(`font-size: 14px; left: "110px"; top: "138px"; width: "30px";`);

    const switchaccount_button = new QPushButton();
    switchaccount_button.setText("Switch Account");
    switchaccount_button.setObjectName('buttontemplate');
    switchaccount_button.setInlineStyle(`top: "175px"; left: "20px"; width: "125px";`);
    switchaccount_button.setFont(this.BoldFont);
    switchaccount_button.setCursor(CursorShape.PointingHandCursor);
    switchaccount_button.addEventListener('clicked', () => { this.Logger.createDebug("Switch Account clicked."); });



    const prefix_label = new QLabel();
    prefix_label.setText("Prefix");
    prefix_label.setFont(this.BoldFont);
    prefix_label.setObjectName("informationlabel");

    this.PrefixLabel = new QLabel();
    this.PrefixLabel.setText("!");
    this.PrefixLabel.setFont(this.MediumFont);
    this.PrefixLabel.setAlignment(AlignmentFlag.AlignRight);
    this.PrefixLabel.setObjectName("informationlabel");
    this.PrefixLabel.setInlineStyle(`top: "13px"; left: "110px"; width: "30px";`);

    const uptime_label = new QLabel();
    uptime_label.setText("Uptime");
    uptime_label.setFont(this.BoldFont);
    uptime_label.setObjectName("informationlabel");
    uptime_label.setInlineStyle(`top: "35px";`);

    this.UptimeLabel = new QLabel();
    this.UptimeLabel.setText("1 day");
    this.UptimeLabel.setFont(this.MediumFont);
    this.UptimeLabel.setAlignment(AlignmentFlag.AlignRight);
    this.UptimeLabel.setObjectName("informationlabel");
    this.UptimeLabel.setInlineStyle(`top: "38px"; left: "90px"; width: "50px";`);

    const version_label = new QLabel();
    version_label.setText("Version");
    version_label.setFont(this.BoldFont);
    version_label.setObjectName("informationlabel");
    version_label.setInlineStyle(`top: "60px";`);

    const version_number_label = new QLabel();
    version_number_label.setText(this.Version);
    version_number_label.setFont(this.MediumFont);
    version_number_label.setAlignment(AlignmentFlag.AlignRight);
    version_number_label.setObjectName("informationlabel");
    version_number_label.setInlineStyle(`top: "63px"; left: "90px"; width: "50px";`);

    const status_label = new QLabel();
    status_label.setText("Status");
    status_label.setFont(this.BoldFont);
    status_label.setObjectName("informationlabel");
    status_label.setInlineStyle(`top: "85px";`);

    const status_s_label = new QLabel();
    status_s_label.setText("OK");
    status_s_label.setFont(this.MediumFont);
    status_s_label.setAlignment(AlignmentFlag.AlignRight);
    status_s_label.setObjectName("informationlabel");
    status_s_label.setInlineStyle(`top: "88px"; left: "90px"; width: "50px"; color: green;`);



    const advertising_button = new QPushButton();
    advertising_button.setInlineStyle(`width: "160px;"; height: "190px"; background-color: rgba(0, 0, 0, 0); border-image: url(${AdvertisementImage}) 0 0 0 0 stretch stretch; border-radius: "10px";`);
    advertising_button.setCursor(CursorShape.PointingHandCursor);
    advertising_button.addEventListener('clicked', () => { this.Logger.createDebug("Advertisement clicked."); });

    this.CoreRoot.addWidget(title_label);
    this.CoreRoot.addWidget(exit);
    this.CoreRoot.addWidget(minimize);

    this.ProfileRoot.addWidget(this.ProfilePicture);
    this.ProfileRoot.addWidget(this.UsernameLabel);
    this.ProfileRoot.addWidget(friends_label);
    this.ProfileRoot.addWidget(this.FriendsLabel);
    this.ProfileRoot.addWidget(servers_label);
    this.ProfileRoot.addWidget(this.ServerLabel);
    this.ProfileRoot.addWidget(switchaccount_button);

    this.InformationRoot.addWidget(prefix_label);
    this.InformationRoot.addWidget(this.PrefixLabel);
    this.InformationRoot.addWidget(uptime_label);
    this.InformationRoot.addWidget(this.UptimeLabel);
    this.InformationRoot.addWidget(version_label);
    this.InformationRoot.addWidget(version_number_label);
    this.InformationRoot.addWidget(status_label);
    this.InformationRoot.addWidget(status_s_label);

    this.AdvertisingRoot.addWidget(advertising_button);

    this.CoreRoot.addWidget(this.Overlay);
    this.Overlay.setHidden(true);

    this.HasSetup = true;
  }

  CreatePopup(title: string, description: string) {
    this.HasPopup = true;
    this.Overlay.setHidden(false);

    const Window = new QMainWindow();
    const Core = new QWidget();
    const CoreRoot = new FlexLayout();
    const Main = new QWidget();
    const MainRoot = new FlexLayout();
    const Selection = new QWidget();
    const SelectionRoot = new FlexLayout();

    Window.setWindowTitle("Experience"); // Set the Window Title.
    Window.setWindowIcon(new QIcon(Logo)); // Set the Window Icon.

    Core.setObjectName("core"); // Set the object name as 'core'.
    Core.setLayout(CoreRoot); // Set the layout.

    Main.setObjectName("main"); // Set the object name as 'menu'.
    Main.setLayout(MainRoot); // Set the layout.

    Selection.setObjectName("selection"); // Set the object name as 'selection'.
    Selection.setLayout(SelectionRoot); // Set the layout.

    CoreRoot.addWidget(Main);
    CoreRoot.addWidget(Selection);

    Window.setAttribute(WidgetAttribute.WA_TranslucentBackground, true);
    Window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
    Window.setWindowFlag(WindowType.FramelessWindowHint, true);
    Window.setWindowFlag(WindowType.SubWindow, true);
    Window.setFixedSize(400, 300);
    Window.setCentralWidget(Core);
    Window.setStyleSheet(
      `

        #main {
          background-color: #171717;
          height: '245px';
          width: '400px';
          border-style: solid;
          border-color: #262626;
          border-width: '1px';
        }

        #selection {
          background-color: #212121;
          height: '55px';
          width: '400px';
          border-style: solid;
          border-color: #262626;
          border-left-width: '1px';
          border-right-width: '1px';
          border-bottom-width: '1px';
        }

        #okbutton {
          width: '70px';
          height: '35px';
          font-size: 14px;
          background-color: #292929;
          color: #bfbfbf;
          position: absolute;
          left: '320px';
          top: '10px';
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
          border-radius: '5px';
        }
        #okbutton:hover {
          background-color: #313131;
          color: #dedede;
        }

        #title {
          color: #ffffff;
          font-size: 18px;
          position: absolute;
          left: '25px';
          top: '23px';
        }

        #description {
          color: #9c9c9c;
          font-size: 14px;
          position: absolute;
          left: '25px';
          top: '54px';
        }
      `
    );

    const okButton = new QPushButton();
    const titleLabel = new QLabel();
    const descriptionLabel = new QLabel();

    okButton.setText("Ok");
    okButton.setObjectName("okbutton");
    okButton.setFont(this.BoldFont);
    okButton.setCursor(CursorShape.PointingHandCursor);
    okButton.addEventListener('clicked', () => {
      this.HasPopup = false;
      this.Overlay.setHidden(true);

      Window.hide();
      (global as any).win = null;
      Window.delete();
    });

    titleLabel.setText(title);
    titleLabel.setObjectName("title");
    titleLabel.setFont(this.BoldFont);

    descriptionLabel.setText(description);
    descriptionLabel.setObjectName("description");
    descriptionLabel.setFont(this.MediumFont);

    SelectionRoot.addWidget(okButton);

    MainRoot.addWidget(titleLabel);
    MainRoot.addWidget(descriptionLabel);

    // Show window.
    Window.show();
    (global as any).win = Window;
  }

  Authenticate(callback: Function) {
    const Window = new QMainWindow();
    const Main = new QWidget();
    const MainRoot = new FlexLayout();

    Window.setWindowTitle("Experience"); // Set the Window Title.
    Window.setWindowIcon(new QIcon(Logo)); // Set the Window Icon.

    Main.setObjectName("main"); // Set the object name as 'menu'.
    Main.setLayout(MainRoot); // Set the layout.

    Window.setAttribute(WidgetAttribute.WA_TranslucentBackground, true);
    Window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
    Window.setWindowFlag(WindowType.FramelessWindowHint, true);
    Window.setFixedSize(650, 300);
    Window.setCentralWidget(Main);
    Window.setStyleSheet(
      `
        #main {
          background-color: #171717;
          height: '300px';
          width: '600px';
          border-style: solid;
          border-color: #262626;
          border-width: '0px';
        }

        #base {
          width: '35px';
          height: '8px';
          position: absolute;
          background-color: qlineargradient(x1: -0.5, y1: 1, x2: 1.5, y2: 1, stop: 0 rgba(245,205,27,1), stop: 0.5 rgba(236,78,179,1), stop: 1 rgba(65,198,210,1));
          border-width: '0px';
          border-style: solid;
          border-color: #171717;
          border-radius: '3px';
        }

        #loginbutton {
          width: '120px';
          height: '35px';
          font-size: 12px;
          background-color: #ffffff;
          color: #0f0f0f;
          position: absolute;
          left: '335px';
          top: '200px';
          border-style: solid;
          border-color: #f0f0f0;
          border-width: '1px';
          border-radius: '10px';
        }
        #loginbutton:hover {
          background-color: #c9c9c9;
          color: #363636;
        }

        #exitbutton {
          background-color: #292929;
          color: #9c9c9c;
          font-size: 12px;
          width: '120px';
          height: '35px';
          position: absolute;
          left: '465px';
          top: '200px';
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
          border-radius: '10px';
        }
        #exitbutton:hover {
          background-color: #303030;
          color: #c7c7c7;
        }

        #textfield {
          background-color: #292929;
          color: #9c9c9c;
          font-size: 12px;
          height: '40px';
          width: '250px';
          position: absolute;
          left: '335px';
          top: '70px';
          border-style: solid;
          border-color: #3b3b3b;
          border-width: '1px';
          border-radius: '5px';
        }

        #label {
          color: #8a8a8a;
          font-size: '12px';
          position: absolute;
          left: '340px';
          top: '52px';
        }
      `
    );

    const exitButton = new QPushButton();
    const loginButton = new QPushButton();
    const usernameTF = new QLineEdit();
    const usernameLabel = new QLabel();
    const passwordTF = new QLineEdit();
    const passwordLabel = new QLabel();
    const titleLabel = new QLabel();
    const subtitleLabel = new QLabel();

    exitButton.setText("Exit");
    exitButton.setObjectName("exitbutton");
    exitButton.setFont(this.BoldFont);
    exitButton.setCursor(CursorShape.PointingHandCursor);
    exitButton.addEventListener('clicked', () => { Window.hide(); (global as any).win = null; Window.delete(); exit(1); });

    loginButton.setText("Login");
    loginButton.setObjectName("loginbutton");
    loginButton.setFont(this.BoldFont);
    loginButton.setCursor(CursorShape.PointingHandCursor);
    loginButton.addEventListener('clicked', () => {
      var usern = usernameTF.text();
      var passw = passwordTF.text();

      if (usern.length > 0 && passw.length > 0) {
        passw = this.Crypto.SHA512(passw);

        this.Username = usern;
        this.Password = passw;

        Promise.resolve(callback(usern, passw))
          .then(() => {
            Window.hide();
            (global as any).win = null;
            Window.delete();
          })
          .catch((error: any) => {
            this.Logger.createError(`Login callback failed: ${error?.toString?.() ?? error}`);
          });
      }
      else {
        this.Logger.createAlert(`User attempted to authenticate with little or no data.`);
      }
    });

    usernameTF.setPlaceholderText("john.doe.1");
    usernameTF.setObjectName("textfield");
    usernameTF.setFont(this.MediumFont);
    usernameTF.setCursor(CursorShape.IBeamCursor);
    usernameTF.setTextMargins(10, 0, 0, 0);

    usernameLabel.setText("Username");
    usernameLabel.setObjectName("label");
    usernameLabel.setFont(this.BoldFont);

    passwordTF.setPlaceholderText("password_123!");
    passwordTF.setObjectName("textfield");
    passwordTF.setInlineStyle("top: '138px';");
    passwordTF.setFont(this.MediumFont);
    passwordTF.setCursor(CursorShape.IBeamCursor);
    passwordTF.setTextMargins(10, 0, 0, 0);
    passwordTF.setEchoMode(EchoMode.Password);
    /*
    // For some odd fucking reason this function
    // will not work, it just exits the app and
    // does not actually end up doing the callback.
    passwordTF.addEventListener('returnPressed', () => {
      var usern = usernameTF.text();
      var passw = passwordTF.text();

      if (usern.length > 0 && passw.length > 0) {
        passw = this.Crypto.SHA512(passw);

        this.Username = usern;
        this.Password = passw;

        Window.hide();
        (global as any).win = null;
        Window.delete();
        callback(usern, passw);
      }
      else {
        this.Logger.createAlert(`User attempted to authenticate with little or no data.`);
      }
    });
    */

    passwordLabel.setText("Password");
    passwordLabel.setObjectName("label");
    passwordLabel.setInlineStyle("top: '120px';");
    passwordLabel.setFont(this.BoldFont);

    titleLabel.setText("Welcome back,");
    titleLabel.setObjectName("label");
    titleLabel.setInlineStyle("top: '105px'; left: '60px'; font-size: 28px; color: #b3b3b3;");
    titleLabel.setFont(this.BoldFont);

    subtitleLabel.setText("David");
    subtitleLabel.setObjectName("label");
    subtitleLabel.setInlineStyle("top: '140px'; left: '60px'; font-size: 24px; color: #9c9c9c;");
    subtitleLabel.setFont(this.MediumFont);

    MainRoot.addWidget(usernameTF);
    MainRoot.addWidget(usernameLabel);
    MainRoot.addWidget(passwordTF);
    MainRoot.addWidget(passwordLabel);
    MainRoot.addWidget(loginButton);
    MainRoot.addWidget(exitButton);
    MainRoot.addWidget(titleLabel);
    MainRoot.addWidget(subtitleLabel);

    // Show window.
    Window.show();
    (global as any).win = Window;
  }

  Show() {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return; }

    void this.Update().catch((error) => {
      this.Logger.createError(`Failed to update experience UI: ${error?.toString?.() ?? error}`);
    });

    var idx = 0; // Index.
    var tgt_idx = this._Menus.ScrollArea.length; // ScrollArea array length.

    while (idx != tgt_idx) // while index != ScrollArea array length.
    {
      // Set the ScrollArea's widget from the Widget array.
      (this._Menus.ScrollArea[idx] as QScrollArea).setWidget(this._Menus.Widget[idx]);

      var num = this._Menus.Actions[idx];
      var height = ((60 * num) + (5 * num)) + 12;

      if (num > 9) {
        this._Menus.Widget[idx].setFixedHeight(height);
      }

      idx++; // Add +1 to Index.
    }

    // Show window.
    this.Window.show();
    this.Window.center();
    (global as any).win = this.Window;
  }

  Hide() {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return; }

    // Hide window.
    this.Window.hide();
    (global as any).win = null;
  }

  async Update() {
    this.UsernameLabel.setText(this.Username);
    this.FriendsLabel.setText(this.Friends);
    this.ServerLabel.setText(this.Servers);
    this.PrefixLabel.setText(this.Prefix);
    this.UptimeLabel.setText(this.Uptime);

    try {
      if (this.UserID.length > 0 && /^\d+$/.test(this.UserID)) {
        var userdata = JSON.parse(await Cryptography.GetUserData(this.UserID));

        if (userdata?.avatar) {
          this.Crypto.DownloadImage(`https://cdn.discordapp.com/avatars/${this.UserID}/${userdata.avatar}?size=48`, `${__dirname}/image.png`, () => {
            this.ProfilePicture.setInlineStyle(`background-image: url('${ProfileImage}');`);
            console.log(`${__dirname.split('\\').join('/')}/image.png`);
          });
          return;
        }
      }
    }
    catch (error) {
      this.Logger.createAlert(`Discord profile fetch failed, using local avatar instead. (${error?.toString?.() ?? error})`);
    }

    this.ProfilePicture.setInlineStyle(`background-image: url('${ProfileImage}');`);
  }

  SwitchWindow(idx: number) {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return; }

    // Foreach ScrollArea in the array.
    this._Menus.ScrollArea.forEach((item: QScrollArea) => {
      // Hide ScrollArea.
      item.setVisible(false);
    });

    var idxx = 0;

    this._Menus.Labels.forEach((item: QLabel) => {
      item.setInlineStyle(`top: ${((idxx * 45) + 20).toString()}px; color: #9c9c9c;`);
      idxx++;
    });

    // Show ScrollArea using the index.
    this._Menus.ScrollArea[idx].setVisible(true);

    // Raise ScrollArea.
    this._Menus.ScrollArea[idx].raise();
  }

  AddMenuItem(layout: Layout, title: string, active_icon: string, inactive_icon: string, callback: CallableFunction): number {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return -1; }

    this.Logger.createDebug(`Adding menu item as PageID ${this.MenuItems}..`);

    // Create new menu selection.
    const _Button = new QPushButton();
    const _MenuLabel = new QLabel();

    // Create new menu.
    var _NewMenuRoot;
    const _NewMenu = new QWidget();
    const _NewScrollArea = new QScrollArea();

    switch (layout) {
      case Layout.Flex:
        _NewMenuRoot = new FlexLayout();
        break;
      case Layout.Grid:
        _NewMenuRoot = new QGridLayout();
        break;
      case Layout.Box:
        _NewMenuRoot = new QBoxLayout(0);
        break;
    }

    _NewScrollArea.setFrameStyle(-1); // Set frame style as custom.
    _NewScrollArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff); // Invisible Vertical ScrollBar.
    _NewScrollArea.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff); // Invisible Horizontal ScrollBar.
    _NewScrollArea.setWidgetResizable(true); // Set widget resizeable.
    _NewScrollArea.setFixedSize(600, 550);

    _NewScrollArea.setObjectName("menuscroll");

    _NewMenu.setFixedSize(600, 550);
    _NewMenu.setObjectName("menuholder"); // Set styling.
    _NewMenu.setLayout(_NewMenuRoot); // Add FlexLayout as the layout.

    this._Menus.Root.push(_NewMenuRoot); // Add to Root array.
    this._Menus.Widget.push(_NewMenu); // Add to Widget array.
    this._Menus.ScrollArea.push(_NewScrollArea); // Add to ScrollArea array.
    this._Menus.Actions.push(0); // Add to Actions array.
    this._Menus.Buttons.push(_Button); // Add to Button array.
    this._Menus.Labels.push(_MenuLabel); // Add to Label array.

    // Cache the index of the new menu in array.
    const idx = this.MenuItems;

    // Create active and inactive icons.
    const a_icon = new QIcon();
    const ia_icon = new QIcon();

    a_icon.addFile(active_icon);
    ia_icon.addFile(inactive_icon);

    // Add icons to array.
    this._Menus.Active_Icons.push(a_icon);
    this._Menus.Inactive_Icons.push(ia_icon);

    _MenuLabel.setText(title);
    _MenuLabel.setObjectName("menulabel"); // Set style from stylesheet.
    _MenuLabel.setFont(this.BoldFont); // Set font from global fonts.
    _MenuLabel.setCursor(CursorShape.PointingHandCursor); // Set cursor as PointingHandCursor.
    _MenuLabel.setInlineStyle(`top: ${((this.MenuItems * 45) + 20).toString()}px;`); // Move button left
    _MenuLabel.addEventListener(WidgetEventTypes.MouseButtonPress, () => {
      if (!this.ViewingStoreItem) {
        this.SwitchWindow(idx);

        // Set all inactive.
        var midx = 0;
        this._Menus.Buttons.forEach((item: QPushButton) => {
          item.setIcon(this._Menus.Inactive_Icons[midx]);
          midx++;
        });

        // Set active.
        _Button.setIcon(this._Menus.Active_Icons[idx]);
        _MenuLabel.setInlineStyle(`top: ${((idx * 45) + 20).toString()}px; color: #ffffff;`);

        callback();
      }
    });

    if (this.MenuItems == 0) { _Button.setIcon(a_icon); } else { _Button.setIcon(ia_icon); }
    _Button.setIconSize(new QSize(25, 25));
    _Button.setObjectName("menubutton"); // Set style from stylesheet.
    _Button.setFont(this.BoldFont); // Set font from global fonts.
    _Button.setCursor(CursorShape.PointingHandCursor); // Set cursor as PointingHandCursor.
    _Button.setInlineStyle(`top: ${((this.MenuItems * 45) + 15).toString()}px;`); // Move button left
    _Button.addEventListener('clicked', () => {
      if (!this.ViewingStoreItem) {
        this.SwitchWindow(idx);

        // Set all inactive.
        var midx = 0;
        this._Menus.Buttons.forEach((item: QPushButton) => {
          item.setIcon(this._Menus.Inactive_Icons[midx]);
          midx++;
        });

        // Set active.
        _Button.setIcon(this._Menus.Active_Icons[idx]);
        _MenuLabel.setInlineStyle(`top: ${((idx * 45) + 20).toString()}px; color: #ffffff;`);

        callback();
      }
    });

    this.MenuRoot.addWidget(_MenuLabel); // Add button as a widget for MenuRoot.
    this.MenuRoot.addWidget(_Button); // Add button as a widget for MenuRoot.
    this.CoreRoot.addWidget(_NewMenu); // Add menu as a widget for MainRoot.
    this.CoreRoot.addWidget(_NewScrollArea); // Add scrollarea as a widget for MainRoot.

    if (this.MenuItems == 0) { _NewScrollArea.setVisible(true); _MenuLabel.setInlineStyle(`top: ${((idx * 45) + 20).toString()}px; color: #ffffff;`); } else { _NewScrollArea.setVisible(false); } // Set Visibility.

    this.MenuItems++; // Add 1 to MenuItems.

    return idx; // Return index from array.
  }

  AddElement(idx: number, element: Elements, ...args: any[]) {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return; }

    switch (element) {
      case Elements.Announcement:
        // args[0] = Title
        // args[1] = Description

        // ArgCheck.
        if (args.length > 2) { this.Logger.createAlert(`Too many args while creating a Announcement on PageID ${idx}`); return; }
        if (args.length < 2) { this.Logger.createAlert(`Not enough args while creating a Announcement on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Announcement on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Announcement on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating Announcement on PageID ${idx}..`);

        // Create the FlexLayout.
        var announcement_panel_root = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var announcement_panel = new QWidget();
        announcement_panel.setObjectName('actionholder');
        announcement_panel.setLayout(announcement_panel_root);

        // Create the Gradient.
        var gradient_obj = new QWidget();
        gradient_obj.setObjectName('announcementtemplate');

        // Create the Title.
        var title_label = new QLabel();
        title_label.setText(args[0]);
        title_label.setObjectName('titletemplate');
        title_label.setInlineStyle('left: 60px;');
        title_label.setFont(this.BoldFont);

        // Create the Description.
        var description_label = new QLabel();
        description_label.setText(args[1]);
        description_label.setObjectName('descriptiontemplate');
        description_label.setInlineStyle('left: 60px;');
        description_label.setFont(this.MediumFont);

        // Add Widgets to FlexLayout.
        announcement_panel_root.addWidget(title_label);
        announcement_panel_root.addWidget(description_label);
        announcement_panel_root.addWidget(gradient_obj);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(announcement_panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
      case Elements.Terminal:
        if (!this.HasTerminal) {
          this.Logger.createDebug(`Creating Terminal on PageID ${idx}..`);

          // Create the FlexLayout.
          var output_panel_root = new FlexLayout();
          var input_panel_root = new FlexLayout();

          // Create the Widget and assign the FlexLayout.
          var output_panel = new QWidget();
          output_panel.setObjectName('actionholder');
          output_panel.setInlineStyle('height: "480px;"');
          output_panel.setLayout(output_panel_root);

          var input_panel = new QWidget();
          input_panel.setObjectName('actionholder');
          input_panel.setInlineStyle('height: "50px;"');
          input_panel.setLayout(input_panel_root);


          var input = new QLineEdit();
          input.setTextMargins(10, 0, 10, 0);
          input.setObjectName('textfieldtemplate');
          input.setInlineStyle(`left: "13px"; top: "13px"; width: "561px";`);
          input.setFont(this.ConsoleFont);
          input.setCursor(CursorShape.IBeamCursor);
          input.addEventListener('returnPressed', () => { this.ParseCommand(input.text()); input.clear(); this.CachedCommandIndex = 0; });
          input.addEventListener(WidgetEventTypes.KeyPress, (e: any) => {
            const event = new QKeyEvent(e);

            if (event.key() == Key.Key_Up) {
              if (this.CachedCommands.length > 0) {
                if (this.CachedCommandIndex == 0) {
                  this.CachedCommandIndex = this.CachedCommands.length;
                }

                this.CachedCommandIndex--;

                input.setText(this.CachedCommands[this.CachedCommandIndex]);
              }
            }

          });

          var output = this.PublicLogger;
          output.setObjectName('textfieldtemplate');
          output.setPlainText("");
          output.setInlineStyle(`font-size: 13px; left: "13px"; top: "13px"; width: "561px"; height: "456px";`);
          output.setFont(this.ConsoleFont);
          output.setReadOnly(true);


          input_panel_root.addWidget(input);
          output_panel_root.addWidget(output);

          // Add Widget to Root.
          (this._Menus.Root[idx] as FlexLayout).addWidget(output_panel);
          (this._Menus.Root[idx] as FlexLayout).addWidget(input_panel);
          this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

          this.HasTerminal = true;

          this.Log(Level.Debug, "This is an example of a debug message..");
          this.Log(Level.Alert, "This is an example of a alert message..");
          this.Log(Level.Error, "This is an example of a error message..");
          this.Log(Level.Fatal, "This is an example of a fatal message..");
        }
        else {
          this.Logger.createAlert(`An existing terminal already exists.`);
        }

        return;
      case Elements.StoreItem:
        // args[0] = Title
        // args[1] = Description

        // ArgCheck.
        if (args.length > 2) { this.Logger.createAlert(`Too many args while creating a Button on PageID`); return; }
        if (args.length < 2) { this.Logger.createAlert(`Not enough args while creating a Button on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Button on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating StoreItem on PageID ${idx}..`);

        // Create the FlexLayout.
        var storeitem_root = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var storeitem = new QWidget();
        storeitem.setObjectName('actionholder');
        storeitem.setInlineStyle(`height: "120px";`);
        storeitem.setLayout(storeitem_root);

        var image_button = new QPushButton();
        image_button.setInlineStyle(`left: "25px"; top: "18px"; width: "35px;"; height: "35px"; background-color: rgba(0, 0, 0, 0); border-image: url(${PluginImage}) 0 0 0 0 stretch stretch; border-radius: "15px";`);
        image_button.setCursor(CursorShape.PointingHandCursor);
        image_button.addEventListener('clicked', () => { this.Logger.createDebug("Advertisement clicked."); });

        var title_label = new QLabel();
        title_label.setText(args[0]);
        title_label.setObjectName('titletemplate');
        title_label.setInlineStyle(`top: "24px"; left: "75px"; font-size: 17px;`);
        title_label.setFont(this.BoldFont);

        var description_textedit = new QTextEdit();
        description_textedit.setReadOnly(true);
        description_textedit.setCursor(CursorShape.ArrowCursor);
        description_textedit.setText(args[1]);
        description_textedit.setObjectName('textfieldtemplate');
        description_textedit.setInlineStyle(`top: "60px"; left: "20px"; font-size: 12px; height: "60px"; width: "450px"; background-color: rgba(0, 0, 0, 0); border-width: "0px";`);
        description_textedit.setFont(this.MediumFont);

        // Create the Action/Button.
        var install_button = new QPushButton();
        install_button.setText("Install");
        install_button.setObjectName('buttontemplate');
        install_button.setInlineStyle(`top: "30px";`);
        install_button.setFont(this.BoldFont);
        install_button.setCursor(CursorShape.PointingHandCursor);
        install_button.addEventListener('clicked', () => { this.CreatePopup("Hello", "World"); });

        var details_button = new QPushButton();
        details_button.setText("Details");
        details_button.setObjectName('buttontemplate');
        details_button.setInlineStyle(`top: "65px";`);
        details_button.setFont(this.BoldFont);
        details_button.setCursor(CursorShape.PointingHandCursor);
        details_button.addEventListener('clicked', () => { this.ViewStoreItem(0); });

        // Add Widgets to FlexLayout.
        storeitem_root.addWidget(image_button);
        storeitem_root.addWidget(title_label);
        storeitem_root.addWidget(description_textedit);
        storeitem_root.addWidget(install_button);
        storeitem_root.addWidget(details_button);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(storeitem);

        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 2;

        return;
      case Elements.Title:
        // args[0] = Title

        // ArgCheck.
        if (args.length > 1) { this.Logger.createAlert(`Too many args while creating a Announcement on PageID ${idx}`); return; }
        if (args.length < 1) { this.Logger.createAlert(`Not enough args while creating a Announcement on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Announcement on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating Title on PageID ${idx}..`);

        // Create the FlexLayout.
        var announcement_panel_root = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var announcement_panel = new QWidget();
        announcement_panel.setObjectName('actionholder');
        announcement_panel.setInlineStyle(`background-color: rgba(0, 0, 0, 0); border-color: rgba(0, 0, 0, 0); height: "30px";`);
        announcement_panel.setLayout(announcement_panel_root);

        // Create the Title.
        var title_label = new QLabel();
        title_label.setText(args[0]);
        title_label.setObjectName('titletemplate');
        title_label.setInlineStyle('left: "15px"; top: "10px"; font-size: 16px;');
        title_label.setFont(this.BoldFont);

        var seperator_panel = new QWidget();
        seperator_panel.setInlineStyle(`background-color: rgba(155, 155, 155, 0.5); width: "420px"; height: "1px"; left: "150px"; top: "20px";`);

        // Add Widgets to FlexLayout.
        announcement_panel_root.addWidget(title_label);
        announcement_panel_root.addWidget(seperator_panel);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(announcement_panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 0.5;
        return;
    }
  }

  AddAction(idx: number, action: Actions, ...args: any[]) {
    if (!this.HasSetup) { this.Logger.createError(`Setup() has not been called yet, please call the function before anything else.`); return; }

    switch (action) {
      case Actions.Button:
        // args[0] = Title
        // args[1] = Description
        // args[2] = Button
        // args[3] = Action

        // ArgCheck.
        if (args.length > 4) { this.Logger.createAlert(`Too many args while creating a Button on PageID`); return; }
        if (args.length < 4) { this.Logger.createAlert(`Not enough args while creating a Button on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[2] != 'string') { this.Logger.createAlert(`Invalid arg2 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[3] != 'function') { this.Logger.createAlert(`Invalid arg3 while creating a Button on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating Button on PageID ${idx}..`);

        // Create the FlexLayout.
        var _PanelRoot = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var _Panel = new QWidget();
        _Panel.setObjectName('actionholder');
        _Panel.setLayout(_PanelRoot);

        // Create the Title.
        var _Title = new QLabel();
        _Title.setText(args[0]);
        _Title.setObjectName('titletemplate');
        _Title.setFont(this.BoldFont);

        // Create the Description.
        var _Description = new QLabel();
        _Description.setText(args[1]);
        _Description.setObjectName('descriptiontemplate');
        _Description.setFont(this.MediumFont);

        // Create the Action/Button.
        var _Action = new QPushButton();
        _Action.setText(args[2]);
        _Action.setObjectName('buttontemplate');
        _Action.setFont(this.BoldFont);
        _Action.setCursor(CursorShape.PointingHandCursor);
        _Action.addEventListener('clicked', () => { args[3](); });

        // Add Widgets to FlexLayout.
        _PanelRoot.addWidget(_Title);
        _PanelRoot.addWidget(_Description);
        _PanelRoot.addWidget(_Action);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(_Panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
      case Actions.TextField:
        // args[0] = Title
        // args[1] = Description
        // args[2] = Default
        // args[3] = Action

        // ArgCheck.
        if (args.length > 4) { this.Logger.createAlert(`Too many args while creating a TextField on PageID`); return; }
        if (args.length < 4) { this.Logger.createAlert(`Not enough args while creating a TextField on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a TextField on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a TextField on PageID ${idx}`); return; }
        if (typeof args[2] != 'string') { this.Logger.createAlert(`Invalid arg2 while creating a TextField on PageID ${idx}`); return; }
        if (typeof args[3] != 'function') { this.Logger.createAlert(`Invalid arg3 while creating a TextField on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating TextField on PageID ${idx}..`);

        // Create the FlexLayout.
        var _PanelRoot = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var _Panel = new QWidget();
        _Panel.setObjectName('actionholder');
        _Panel.setLayout(_PanelRoot);

        // Create the Title.
        var _Title = new QLabel();
        _Title.setText(args[0]);
        _Title.setObjectName('titletemplate');
        _Title.setFont(this.BoldFont);

        // Create the Description.
        var _Description = new QLabel();
        _Description.setText(args[1]);
        _Description.setObjectName('descriptiontemplate');
        _Description.setFont(this.MediumFont);

        // Create the TextField.
        var _TextField = new QLineEdit();
        _TextField.setPlaceholderText(args[2]);
        _TextField.setTextMargins(10, 0, 10, 0);
        _TextField.setObjectName('textfieldtemplate');
        _TextField.setFont(this.MediumFont);
        _TextField.setCursor(CursorShape.IBeamCursor);
        _TextField.addEventListener('returnPressed', () => { args[3](_TextField.text()); });

        // Add Widgets to FlexLayout.
        _PanelRoot.addWidget(_Title);
        _PanelRoot.addWidget(_Description);
        _PanelRoot.addWidget(_TextField);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(_Panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
      case Actions.Slider:
        // args[0] = Title
        // args[1] = Description
        // args[2] = Base
        // args[3] = Action

        // ArgCheck.
        if (args.length > 4) { this.Logger.createAlert(`Too many args while creating a Slider on PageID`); return; }
        if (args.length < 4) { this.Logger.createAlert(`Not enough args while creating a Slider on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Slider on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Slider on PageID ${idx}`); return; }
        if (typeof args[2] != 'number') { this.Logger.createAlert(`Invalid arg2 while creating a Slider on PageID ${idx}`); return; }
        if (args[2] > 100 || args[2] < 0) { this.Logger.createAlert(`Index out of range for arg2 while creating a Slider on PageID ${idx}, default is now 0.`); args[2] = 0; }
        if (typeof args[3] != 'function') { this.Logger.createAlert(`Invalid arg3 while creating a Slider on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating Slider on PageID ${idx}..`);

        // Create the FlexLayout.
        var _PanelRoot = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var _Panel = new QWidget();
        _Panel.setObjectName('actionholder');
        _Panel.setLayout(_PanelRoot);

        // Create the Title.
        var _Title = new QLabel();
        _Title.setText(args[0]);
        _Title.setObjectName('titletemplate');
        _Title.setFont(this.BoldFont);

        // Create the Description.
        var _Description = new QLabel();
        _Description.setText(args[1]);
        _Description.setObjectName('descriptiontemplate');
        _Description.setFont(this.MediumFont);

        // Create the TextField.
        var _Slider = new QSlider();
        _Slider.setOrientation(Orientation.Horizontal);
        _Slider.setObjectName('slidertemplate');
        _Slider.setValue(args[2]);
        _Slider.setCursor(CursorShape.PointingHandCursor);
        _Slider.addEventListener('sliderReleased', () => { args[3](_Slider.value()); });

        // Add Widgets to FlexLayout.
        _PanelRoot.addWidget(_Title);
        _PanelRoot.addWidget(_Description);
        _PanelRoot.addWidget(_Slider);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(_Panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
      case Actions.ColorPicker:
        // args[0] = Title
        // args[1] = Description
        // args[2] = Color
        // args[3] = Action

        // ArgCheck.
        if (args.length > 4) { this.Logger.createAlert(`Too many args while creating a Button on PageID`); return; }
        if (args.length < 4) { this.Logger.createAlert(`Not enough args while creating a Button on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[2] != 'string') { this.Logger.createAlert(`Invalid arg2 while creating a Button on PageID ${idx}`); return; }
        if (typeof args[3] != 'function') { this.Logger.createAlert(`Invalid arg3 while creating a Button on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating ColorPicker on PageID ${idx}..`);

        // Create the FlexLayout.
        var _PanelRoot = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var _Panel = new QWidget();
        _Panel.setObjectName('actionholder');
        _Panel.setLayout(_PanelRoot);

        // Create the Title.
        var _Title = new QLabel();
        _Title.setText(args[0]);
        _Title.setObjectName('titletemplate');
        _Title.setFont(this.BoldFont);

        // Create the Description.
        var _Description = new QLabel();
        _Description.setText(args[1]);
        _Description.setObjectName('descriptiontemplate');
        _Description.setFont(this.MediumFont);

        // Create the Action/Button.
        var _Action = new QPushButton();
        _Action.setObjectName('buttontemplate');
        _Action.setInlineStyle(`background-color: ${args[2]};`);
        _Action.setFont(this.BoldFont);
        _Action.setCursor(CursorShape.PointingHandCursor);
        _Action.addEventListener('clicked', () => {
          const colorDialog = new QColorDialog();
          colorDialog.setWindowIcon(new QIcon(Logo));
          colorDialog.setWindowTitle('Experience');
          colorDialog.setStyleSheet(`
          #oof {
            background-color: rgb(23, 23, 23);
          }
          #oof > QPushButton {
            color: rgb(211, 213, 201);
            background-color: #1f1f1f;
          }
          #oof > QLabel {
            color: rgb(211, 213, 201);
          }
          #oof > QLineEdit {
            color: rgb(211, 213, 201);
            background-color: rgb(36, 36, 44);
          }
          #oof > QSpinBox {
            color: rgb(211, 213, 201);
            background-color: rgb(36, 36, 44);
          }
          `);
          colorDialog.setObjectName('oof');
          colorDialog.show();
          colorDialog.addEventListener('accepted', () => {
            var red = colorDialog.selectedColor().red().toString();
            var green = colorDialog.selectedColor().green().toString();
            var blue = colorDialog.selectedColor().blue().toString();
            var alpha = colorDialog.selectedColor().alpha().toString();
            _Action.setInlineStyle(`background-color: rgba(${red},${green},${blue},${alpha});`);
            args[3](`{ "red": "${red}", "green": "${green}", "blue": "${blue}", "alpha": "${alpha}" }`);
          });
        });

        // Add Widgets to FlexLayout.
        _PanelRoot.addWidget(_Title);
        _PanelRoot.addWidget(_Description);
        _PanelRoot.addWidget(_Action);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(_Panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
      case Actions.Switch:
        // args[0] = Title
        // args[1] = Description
        // args[2] = Switch
        // args[3] = Action

        // ArgCheck.
        if (args.length > 4) { this.Logger.createAlert(`Too many args while creating a Switch on PageID`); return; }
        if (args.length < 4) { this.Logger.createAlert(`Not enough args while creating a Switch on PageID ${idx}`); return; }
        if (typeof args[0] != 'string') { this.Logger.createAlert(`Invalid arg0 while creating a Switch on PageID ${idx}`); return; }
        if (typeof args[1] != 'string') { this.Logger.createAlert(`Invalid arg1 while creating a Switch on PageID ${idx}`); return; }
        if (typeof args[2] != 'number') { this.Logger.createAlert(`Invalid arg2 while creating a Switch on PageID ${idx}`); return; }
        if (typeof args[3] != 'function') { this.Logger.createAlert(`Invalid arg3 while creating a Switch on PageID ${idx}`); return; }

        this.Logger.createDebug(`Creating Switch on PageID ${idx}..`);

        // Create the FlexLayout.
        var panelRoot = new FlexLayout();

        // Create the Widget and assign the FlexLayout.
        var panel = new QWidget();
        panel.setObjectName('actionholder');
        panel.setLayout(panelRoot);

        // Create the Title.
        var titleLabel = new QLabel();
        titleLabel.setText(args[0]);
        titleLabel.setObjectName('titletemplate');
        titleLabel.setFont(this.BoldFont);

        // Create the Description.
        var descriptionLabel = new QLabel();
        descriptionLabel.setText(args[1]);
        descriptionLabel.setObjectName('descriptiontemplate');
        descriptionLabel.setFont(this.MediumFont);

        // Create the Switch.
        var checkBox = new QCheckBox();
        if (args[2] == Switch.Enabled) { checkBox.setChecked(true); } else { checkBox.setChecked(false); }
        checkBox.setObjectName('switchtemplate');
        checkBox.setCursor(CursorShape.PointingHandCursor);
        checkBox.addEventListener('clicked', () => { if (checkBox.isChecked()) { args[3](true); } else { args[3](false); } });

        // Add Widgets to FlexLayout.
        panelRoot.addWidget(titleLabel);
        panelRoot.addWidget(descriptionLabel);
        panelRoot.addWidget(checkBox);

        // Add Widget to Root.
        (this._Menus.Root[idx] as FlexLayout).addWidget(panel);
        this._Menus.Actions[idx] = this._Menus.Actions[idx] + 1;

        return;
    }
  }

  ViewStoreItem(id: number) {
    this.ViewingStoreItem = true;

    const store_item_root = new FlexLayout();
    const store_item = new QWidget();

    store_item.setObjectName(`storeitem`);
    store_item.setLayout(store_item_root);
    store_item.setVisible(false);

    const information_root = new FlexLayout();
    const information = new QWidget();
    information.setInlineStyle(`left: "0px"; top: "0px"; width: "580px"; height: "200px"; background-color: qlineargradient(x1:0 y1:0, x2:0 y2:1, stop:0 rgba(173, 22, 21, 1), stop:0.6 rgba(92, 11, 10, 1), stop:1 rgba(35, 35, 35, 1)); border-top-left-radius: "10px"; border-top-right-radius: "10px";`);
    information.setLayout(information_root);

    const exit = new QPushButton();
    exit.setIcon(new QIcon(ExitStore));
    exit.setIconSize(new QSize(20, 20));
    exit.setObjectName("exit");
    exit.setInlineStyle(`left: "543px"; background-color: rgba(0, 0, 0, 0);`)
    exit.setCursor(CursorShape.PointingHandCursor);
    exit.addEventListener('clicked', () => { this.ViewingStoreItem = false; store_item.delete(); });


    const image_button = new QPushButton();
    image_button.setInlineStyle(`left: "20px"; top: "20px"; width: "120px;"; height: "120px"; background-color: rgba(0, 0, 0, 0); border-image: url(${PluginImage}) 0 0 0 0 stretch stretch; border-radius: "10px";`);
    image_button.setCursor(CursorShape.ArrowCursor);

    const title_label = new QLabel();
    title_label.setText("Example 1");
    title_label.setFont(this.BoldFont);
    title_label.setObjectName("titletemplate");
    title_label.setInlineStyle(`top: "55px"; left: "155px"; font-size: 28px;`);

    const author_label = new QLabel();
    author_label.setText("by Tetunus");
    author_label.setFont(this.BoldFont);
    author_label.setObjectName("titletemplate");
    author_label.setInlineStyle(`top: "90px"; left: "155px"; font-size: 20px; color: #b0b0b0;`);



    const safety_score_panel_root = new FlexLayout();
    const safety_score_panel = new QWidget();
    safety_score_panel.setLayout(safety_score_panel_root);
    safety_score_panel.setObjectName('actionholder');
    safety_score_panel.setInlineStyle(`height: "100px"; width: "565px"; background-color: #282828; border-color: #2d2d2d;`);

    const size_title_label = new QLabel();
    size_title_label.setText("SIZE");
    size_title_label.setFont(this.BoldFont);
    size_title_label.setObjectName("titletemplate");
    size_title_label.setInlineStyle(`top: "32px"; left: "86px";`);

    const size_label = new QLabel();
    size_label.setText("10mb");
    size_label.setFont(this.MediumFont);
    size_label.setObjectName("titletemplate");
    size_label.setAlignment(AlignmentFlag.AlignCenter);
    size_label.setInlineStyle(`top: "52px"; left: "70px"; color: #b0b0b0; font-size: 14px; width: 60px;`);

    const catagory_title_label = new QLabel();
    catagory_title_label.setText("CATAGORY");
    catagory_title_label.setFont(this.BoldFont);
    catagory_title_label.setObjectName("titletemplate");
    catagory_title_label.setInlineStyle(`top: "32px"; left: "186px";`);

    const catagory_label = new QLabel();
    catagory_label.setText("Theme");
    catagory_label.setFont(this.MediumFont);
    catagory_label.setObjectName("titletemplate");
    catagory_label.setAlignment(AlignmentFlag.AlignCenter);
    catagory_label.setInlineStyle(`top: "52px"; left: "189px"; color: #b0b0b0; font-size: 14px; width: 60px;`);

    const version_title_label = new QLabel();
    version_title_label.setText("VERSION");
    version_title_label.setFont(this.BoldFont);
    version_title_label.setObjectName("titletemplate");
    version_title_label.setInlineStyle(`top: "32px"; left: "309px";`);

    const version_label = new QLabel();
    version_label.setText("1.0.0");
    version_label.setFont(this.MediumFont);
    version_label.setObjectName("titletemplate");
    version_label.setAlignment(AlignmentFlag.AlignCenter);
    version_label.setInlineStyle(`top: "52px"; left: "308px"; color: #b0b0b0; font-size: 14px; width: 60px;`);

    const safe_title_label = new QLabel();
    safe_title_label.setText("SAFETY");
    safe_title_label.setFont(this.BoldFont);
    safe_title_label.setObjectName("titletemplate");
    safe_title_label.setInlineStyle(`top: "32px"; left: "433px";`);

    const safe_label = new QLabel();
    safe_label.setText("10/10");
    safe_label.setFont(this.MediumFont);
    safe_label.setObjectName("titletemplate");
    safe_label.setAlignment(AlignmentFlag.AlignCenter);
    safe_label.setInlineStyle(`top: "52px"; left: "427px"; color: #b0b0b0; font-size: 14px; width: 60px;`);

    safety_score_panel_root.addWidget(size_title_label);
    safety_score_panel_root.addWidget(size_label);
    safety_score_panel_root.addWidget(catagory_title_label);
    safety_score_panel_root.addWidget(catagory_label);
    safety_score_panel_root.addWidget(version_title_label);
    safety_score_panel_root.addWidget(version_label);
    safety_score_panel_root.addWidget(safe_title_label);
    safety_score_panel_root.addWidget(safe_label);


    const content_panel_root = new FlexLayout();
    const content_panel = new QWidget();
    content_panel.setLayout(content_panel_root);
    content_panel.setObjectName('actionholder');
    content_panel.setInlineStyle(`height: "150px"; width: "565px"; background-color: #282828; border-color: #2d2d2d;`);

    const content_title_label = new QLabel();
    content_title_label.setText("Information");
    content_title_label.setFont(this.BoldFont);
    content_title_label.setObjectName("titletemplate");
    content_title_label.setInlineStyle(`top: "20px"; left: "25px"; font-size: 15px;`);

    const content_description_textedit = new QTextEdit();
    content_description_textedit.setReadOnly(true);
    content_description_textedit.setCursor(CursorShape.ArrowCursor);
    content_description_textedit.setText(`This is a plugin. It can do anything from add commands to change the entire theme of Experience to add new automated actions to the self bot. They are very versitile and the limits are endless..`);
    content_description_textedit.setObjectName('textfieldtemplate');
    content_description_textedit.setInlineStyle(`top: "40px"; left: "20px"; font-size: 12px; height: "100px"; width: "530px"; background-color: rgba(0, 0, 0, 0); border-width: "0px";`);
    content_description_textedit.setFont(this.MediumFont);

    content_panel_root.addWidget(content_title_label);
    content_panel_root.addWidget(content_description_textedit);


    const actions_panel_root = new FlexLayout();
    const actions_panel = new QWidget();
    actions_panel.setLayout(actions_panel_root);
    actions_panel.setObjectName('actionholder');
    actions_panel.setInlineStyle(`width: "565px"; background-color: #282828; border-color: #2d2d2d;`);

    const install_button = new QPushButton();
    install_button.setText("Install");
    install_button.setObjectName('buttontemplate');
    install_button.setInlineStyle(`top: "18px"; left: "18px"; width: "125px"; background-color: #2c2c2c;`);
    install_button.setFont(this.BoldFont);
    install_button.setCursor(CursorShape.PointingHandCursor);
    install_button.addEventListener('clicked', () => { return; });

    const report_button = new QPushButton();
    report_button.setText("Report");
    report_button.setObjectName('buttontemplate');
    report_button.setInlineStyle(`top: "18px"; left: "153px"; width: "125px"; background-color: #2c2c2c;`);
    report_button.setFont(this.BoldFont);
    report_button.setCursor(CursorShape.PointingHandCursor);
    report_button.addEventListener('clicked', () => { return; });

    actions_panel_root.addWidget(install_button);
    actions_panel_root.addWidget(report_button);



    store_item_root.addWidget(information);
    store_item_root.addWidget(exit);
    store_item_root.addWidget(safety_score_panel);
    store_item_root.addWidget(content_panel);
    store_item_root.addWidget(actions_panel);

    information_root.addWidget(image_button);
    information_root.addWidget(title_label);
    information_root.addWidget(author_label);

    this.CoreRoot.addWidget(store_item);

    setTimeout(() => {
      store_item.setVisible(true);
    }, 250);
  }

  Log(level: Level, data: string) {
    if (this.HasTerminal) {
      var date = new Date(); // Get Date
      var hours = date.getHours(); // Get Hours from 'date'
      var minutes = date.getMinutes(); // Get Minutes from 'date'
      var seconds = date.getSeconds(); // Get Seconds from 'date'

      switch (level) {
        case Level.Debug:
          this.PublicLogger.insertHtml(`[<font color=\"teal\"><bold>DEBUG</bold></font>] (${hours.toString()}:${minutes.toString()}:${seconds.toString()}) - ${data}<br>`);
          break;
        case Level.Alert:
          this.PublicLogger.insertHtml(`[<font color=\"yellow\"><bold>ALERT</bold></font>] (${hours.toString()}:${minutes.toString()}:${seconds.toString()}) - ${data}<br>`);
          break;
        case Level.Error:
          this.PublicLogger.insertHtml(`[<font color=\"orange\"><bold>ERROR</bold></font>] (${hours.toString()}:${minutes.toString()}:${seconds.toString()}) - ${data}<br>`);
          break;
        case Level.Fatal:
          this.PublicLogger.insertHtml(`[<font color=\"red\"><bold>FATAL</bold></font>] (${hours.toString()}:${minutes.toString()}:${seconds.toString()}) - ${data}<br>`);
          break;
      }
    }
    else {
      this.Logger.createAlert(`No terminal detected, please create one then try again..`);
    }
  }

  ParseCommand(data: string) {
    if (this.HasTerminal) {
      if (data.length > 0) {
        this.Log(Level.Debug, `Recieved command. ("${data}")`);

        var dataarr = data.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );

        this.CachedCommands.push(data);

        console.log(dataarr);
      }
    }
    else {
      this.Logger.createAlert(`No terminal detected, please create one then try again..`);
    }
  }
}
