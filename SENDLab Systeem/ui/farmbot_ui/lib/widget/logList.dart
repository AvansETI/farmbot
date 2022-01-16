//Widget that generates a list of logbook items

import 'package:farmbot_ui/Provider/LogbookProvider.dart';
import 'package:farmbot_ui/widget/LogbookItem.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LogbookList extends StatefulWidget {
  const LogbookList({ Key? key }) : super(key: key);

  @override
  _LogbookListState createState() => _LogbookListState();
}

class _LogbookListState extends State<LogbookList> {
  bool _isInit = false;
  bool _isLoading = false;

  @override
  Future<void> didChangeDependencies()async{
    if(!_isInit){
      setState(() {
              _isLoading = true;
            });

     await Provider.of<LogbookProvider>(context, listen: false).getAndSetLogbookItems();
    }

    setState(() {
          _isLoading = false;
        });

    super.didChangeDependencies();
  }

  Future<void> _refreshLogItems(BuildContext context) {
    return Provider.of<LogbookProvider>(context, listen: false)
        .getAndSetLogbookItems();
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: () => _refreshLogItems(context),
            child: Consumer<LogbookProvider>(
              builder: (ctx, logData, child) => logData.logbookItems.length == 0
                  ? Center(
                      child: Text(
                          "No logbook items found."),
                    )
                  : ListView.builder(
                      itemCount: logData.logbookItems.length,
                      itemBuilder: (ctx, i) =>
                          LogbookItem(logItem: logData.logbookItems[i]),
                    ),
            ),
          );
  }
}