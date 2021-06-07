//Homescreen of the Farmbot ui
import 'package:farmbot_ui/Model/logItem.dart';
import 'package:farmbot_ui/Provider/LogbookProvider.dart';
import 'package:farmbot_ui/widget/LogbookItem.dart';
import 'package:farmbot_ui/widget/drawer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  static const routeName = "/home";
  const HomeScreen({ Key key }) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isInit = false;
  bool _isLoading = false;
  LogItem _lastLogItem;

 @override
  Future<void> didChangeDependencies()async{
    if(!_isInit){
      setState(() {
              _isLoading = true;
            });

     _lastLogItem = Provider.of<LogbookProvider>(context, listen: false).getLastLogItem();
    }

    setState(() {
          _isLoading = false;
        });

    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Home"),
      ),
      //initialization of the menu
      drawer: AppDrawer(),
      //The body of the screen
      body: Row(
        children: [
          Column(
            children: [
              Row(children: [
                Text("Last log: "),
              ],),
              Row(
                children: [
                  LogbookItem(logItem: _lastLogItem]),
                ],
              )
            ],
          )
        ],
      ),
      //The footer of the screen
      bottomNavigationBar: Container(
        height: 40,
        color: Colors.green,
        child: Center(child: Text("© 2021 Avans Hogeschool", style: TextStyle(color: Colors.white),),)
      ),

      
    );
  }
}