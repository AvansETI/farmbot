import 'package:farmbot_ui/Model/logItem.dart';
import 'package:flutter/cupertino.dart';

//class for the getting and keeping the data of the logbook.
class LogbookProvider with ChangeNotifier{
  List<LogItem> _logbookItems = [];

  get logbookItems{
    return [..._logbookItems];
  }

  ///Method fot getting the logbook items
  Future<void> getAndSetLogbookItems() async{
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 0), event: "Moved to position x:200, y:200, z:0 and took picture", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 1), event: "Moved to position x:200, y:300, z:0 and took picture", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 2), event: "Moved to position x:200, y:400, z:0 and took picture", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 4), event: "Moved to position x:300, y:200, z:0 and took picture", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 5), event: "Moved to position x:300, y:300, z:0 and took picture", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 8, 6), event: "Moved to position x:300, y:400, z:0 and took picture", status: "Succeed"));

    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 9, 0), event: "Picket up water nozzle", status: "Succeed"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 9, 2), event: "Start water sequence", status: "Running"));
    this._logbookItems.add(new LogItem(time: new DateTime(2021, 6 ,7 , 10, 22), event: "Complete water sequence", status: "Succeed"));

    this._logbookItems.sort((a,b) => b.time.compareTo(a.time));

    notifyListeners();
  }

  LogItem getLastLogItem(){
    return _logbookItems[0];
  }

}