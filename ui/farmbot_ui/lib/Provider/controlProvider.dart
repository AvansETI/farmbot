import 'dart:async';

import 'package:farmbot_ui/values/endpoints.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

///Class to execute some basic instructions for the farmbot
class ControlProvider with ChangeNotifier{

  ///Method to start the data / camera function.
  ///
  ///[context] is used to show the response snackbar
  Future<void> startDataSequence(BuildContext context) async{
    Uri uri = Uri.parse(EndPoints.dataSequence);
    try{
      var response = await http.get(uri).timeout(Duration(seconds: 10));

     String responseString = response.body;
     showSnackbar(context, responseString);
    }on TimeoutException{
      showSnackbar(context, "server timeout");
      throw "Timeout Exception";
    }
     
  }

  ///Method to start the water function.
  ///
  ///[context] is used to show the response snackbar
  Future<void> startWaterSequence(BuildContext context) async{
    try{
      var response = await http.get(Uri.parse(EndPoints.waterSequence)).timeout(Duration(seconds: 10));

     String responseString = response.body;
     showSnackbar(context, responseString);
    }on TimeoutException{
      showSnackbar(context, "server timeout");
      throw "Timeout Exception";
    }
     
  }

  showSnackbar(BuildContext context, String message) {
    final snackBar = SnackBar(
      content: Text(message),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

}