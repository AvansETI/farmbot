import 'dart:convert';
import 'dart:html' as html;

import 'package:farmbot_ui/Model/plantModel.dart';
import 'package:farmbot_ui/values/endpoints.dart';
import 'package:flutter/cupertino.dart';



import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class PlantProvider with ChangeNotifier{
  List<PlantModel> _plants = [];
  List<String> _plantKinds = [];

  List<PlantModel> get plants{
    return [..._plants];
  }

  List<String> get plantKinds{
    return [..._plantKinds];
  }

  Future<void> getPlants(String plantType) async{
    _plants = [];
    final queryParameters = {
      'plant_type' : plantType
    };

    final uri = Uri.http(EndPoints.baseUrlWithout, EndPoints.getPlantByType, queryParameters);
    final response = await http.get(uri);

    List data = await jsonDecode(response.body);
    data.forEach((element) {
      _plants.add(new PlantModel(id: element["_id"], plantId: element["id"], plantType: element["plant_type"], plantedAt: element["planted_at"], imageDate: element["image_date"], imageID: element["image_id"], humidity: element["humidity"], temperature: element["temperature"]));
    });
    notifyListeners();

  }

  Future<List<String>> getPlantKinds() async{
    _plantKinds = [];
    final uri = Uri.parse(EndPoints.getTypes);
    final response = await http.get(uri);

    List data = await jsonDecode(response.body);
    data.forEach((element) {
      print(element);
      _plantKinds.add(element);
    });
    notifyListeners();
    return _plantKinds;
  }

  void exportPlantToFile(){
    String dateTime = DateFormat("dd:MM:yyyy-kk:mm").format(DateTime.now());
    final json = jsonEncode(_plants);

    final bytes = utf8.encode(json);
    final blob = html.Blob([bytes]);
    final url = html.Url.createObjectUrlFromBlob(blob);
    final anchor = html.document.createElement('a') as html.AnchorElement
      ..href = url
      ..style.display = 'none'
      ..download = "fb_dataset_export_"+dateTime+".json";

      html.document.body!.children.add(anchor);

      anchor.click();

      html.document.body!.children.remove(anchor);
      html.Url.revokeObjectUrl(url);
  }
}