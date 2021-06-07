import 'package:flutter/cupertino.dart';

//Model of the logbook items
class LogItem{
  DateTime time;
  String event;
  String status;

  LogItem({@required this.time, @required this.event, @required this.status});

  DateTime get getTime => this.time;

  String get getEvent => this.event;

  String get getStatus => this.status;

}