import 'dart:typed_data';

class PlantModel{
  final String id;
  final int plantId;
  final String plantType;
  final String plantedAt;
  final String imageDate;
  final String imageID;
  final int humidity;
  final double temperature;

  PlantModel({required this.id, required this.plantId, required this.plantType, required this.plantedAt, required this.imageDate, required this.imageID, required this.humidity, required this.temperature});

  toJson(){
    Map<String, dynamic> m = new Map();

    m['id'] = id;
    m['plantID'] = plantId;
    m["plantType"] = plantType;
    m["plantedAt"] = plantedAt;
    m["imageDate"] = imageDate;
    m["imageID"] = imageID;
    m["humidity"] = humidity;
    m["temperature"] = temperature;

    return m;
  }
}