import 'package:farmbot_ui/Model/plantModel.dart';
import 'package:farmbot_ui/values/endpoints.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PlantItem extends StatelessWidget {
  final PlantModel plant;
  const PlantItem({Key? key, required this.plant}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      child: Card(
        color: Colors.green[100],
        elevation: 4.0,
        child: Row(
          children: <Widget>[
            Expanded(
              flex: 2,
              child: Image.network(EndPoints.getImage + plant.imageID),
            ),
            Expanded(
                flex: 6,
                child: ListTile(
                  title: Text("Plant type: ${plant.plantType}"),
                  subtitle: Column(
                      children: [
                        Row(
                          children: [
                            Text(
                                "Planted at: ${_ignoreSubMicro(plant.plantedAt)} Image at: ${_ignoreSubMicro(plant.imageDate)}")
                          ],
                        ),
                        Row(
                          children: [
                            Text(
                                "Temperature: ${plant.temperature} Humidity: ${plant.humidity}"),
                          ],
                        )
                      ],
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }


  String _ignoreSubMicro(String s) {
  if (s.length > 27) return s.substring(0, 26) + s[s.length - 1].replaceAll("T", " ");
  return s.replaceAll("T", " ");
}
}
