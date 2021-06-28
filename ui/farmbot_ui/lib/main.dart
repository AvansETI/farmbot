import 'package:farmbot_ui/Provider/LogbookProvider.dart';
import 'package:farmbot_ui/Provider/controlProvider.dart';
import 'package:farmbot_ui/Provider/plantProvider.dart';
import 'package:farmbot_ui/Screen/homeScreen.dart';
import 'package:farmbot_ui/Screen/logbook.dart';
import 'package:farmbot_ui/Screen/plantScreen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      //Define providers in app scope
      providers: [
        ChangeNotifierProvider.value(value: LogbookProvider(),),
        ChangeNotifierProvider.value(value: ControlProvider(),),
        ChangeNotifierProvider.value(value: PlantProvider(),),
      ],
      child: MaterialApp(
      title: 'Farmbot UI',
      theme: ThemeData(
        // is not restarted.
        primarySwatch: Colors.green,
        backgroundColor: Colors.green[50],
      ),
      home: HomeScreen(),
      //define routes in app scope
      routes: {
        HomeScreen.routeName: (ctx) => HomeScreen(),
        Logbook.routeName: (ctx) => Logbook(),
        PlantScreen.routeName: (ctx) => PlantScreen(),
      },
    ),
    );
  }
}

