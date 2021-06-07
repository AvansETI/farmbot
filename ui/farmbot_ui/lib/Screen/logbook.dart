import 'package:farmbot_ui/widget/drawer.dart';
import 'package:farmbot_ui/widget/logList.dart';
import 'package:flutter/material.dart';

class Logbook extends StatefulWidget {
  static const routeName = "/logbook";
  const Logbook({ Key key }) : super(key: key);

  @override
  _LogbookState createState() => _LogbookState();
}

class _LogbookState extends State<Logbook> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("Logbook"),
      ),
      drawer: AppDrawer(),
      body: LogbookList(),
      bottomNavigationBar: Container(
        height: 40,
        color: Colors.green,
        child: Center(child: Text("© 2021 Avans Hogeschool", style: TextStyle(color: Colors.white),),)
      ),
    );
  }
}