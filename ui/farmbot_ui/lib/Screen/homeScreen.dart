//Homescreen of the Farmbot ui
import 'package:farmbot_ui/Model/logItem.dart';
import 'package:farmbot_ui/Provider/LogbookProvider.dart';
import 'package:farmbot_ui/Screen/logbook.dart';
import 'package:farmbot_ui/widget/LogbookItem.dart';
import 'package:farmbot_ui/widget/drawer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  static const routeName = "";
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
    await Provider.of<LogbookProvider>(context, listen: false).getAndSetLogbookItems();
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
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("Home"),
      ),
      //initialization of the menu
      drawer: AppDrawer(),
      //The body of the screen
      body: _isLoading ? Center(child: CircularProgressIndicator(),) : Container(
        width: double.infinity,
        height: double.infinity,
        child: Row(
          children: [
            Expanded(
              child: Column(
                
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(children: [
                      
                      Text("Last log: ", style: TextStyle(fontSize: 24),),
                    ],),
                  ),
                  Row(
                      children: [
                        Expanded(child: LogbookItem(logItem: _lastLogItem)),
                      ],
                    
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(children: [
                      
                      TextButton(onPressed: () => Navigator.of(context).pushNamed(Logbook.routeName), child: Text("Alles weergeven..."))
                    ],),
                  ),
                ],
              ),
            )
          ],
        ),
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