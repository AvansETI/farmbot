import 'package:farmbot_ui/Screen/homeScreen.dart';
import 'package:farmbot_ui/Screen/logbook.dart';
import 'package:flutter/material.dart';

//Navigation Menu
class AppDrawer extends StatefulWidget {
  @override
  _AppDrawerState createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  @override
  Widget build(BuildContext context) {
    
    return Drawer(
      child: Column(
        children: <Widget>[
          //Title of the menu
          AppBar(
            title: Text("Farmbot UI"),
            automaticallyImplyLeading: true,
          ),
          Expanded(
            //List of navigation items
            child: SingleChildScrollView(
                child: Column(
              children: <Widget>[
                ListTile(
                  leading: Icon(Icons.home),
                  title: Text(
                    "Home",
                    
                  ),
                  onTap: () => Navigator.of(context)
                      .pushNamed(HomeScreen.routeName),
                ),
                ListTile(
                  leading: Icon(Icons.event_note),
                  title: Text("Logbook"),
                  onTap: () => Navigator.of(context).pushNamed(Logbook.routeName),
                  ),
                    
                
                        ],
                      )
              
            ),
                ),
          
        ],
      ),
    );
  }
}
