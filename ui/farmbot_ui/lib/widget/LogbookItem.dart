import 'package:farmbot_ui/Model/logItem.dart';
import 'package:flutter/material.dart';

//Layout class for a logbook item
class LogbookItem extends StatefulWidget {
  //Model item that holds the data
  final LogItem? logItem;
  
  const LogbookItem({ Key? key, this.logItem }) : super(key: key);

  

  @override
  _LogbookItemState createState() => _LogbookItemState();
}

class _LogbookItemState extends State<LogbookItem> {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          ListTile(
            title: Text(widget.logItem!.event),
            subtitle: Text("Time: ${widget.logItem!.time}, status: ${widget.logItem!.status}"),
          )
        ],
      ),
    );
  }
}