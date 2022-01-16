import 'package:farmbot_ui/Provider/plantProvider.dart';
import 'package:farmbot_ui/widget/PlantItem.dart';
import 'package:farmbot_ui/widget/drawer.dart';
import 'package:farmbot_ui/widget/logList.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

//Screen for viewing the plant data of the Farmbot ui
class PlantScreen extends StatefulWidget {
  static const routeName = "/plantscreen";
  const PlantScreen({Key? key}) : super(key: key);

  @override
  _PlantScreenState createState() => _PlantScreenState();
}

class _PlantScreenState extends State<PlantScreen> {
  bool _isInit = false;
  bool _isLoading = false;

  List<String> plantTypes = [];

  String selectedKind = "";

  //Get the available kind of plants and the first dataset
  @override
  void didChangeDependencies() async {
    List<String> tempKinds = [];
    if (!_isInit) {
      setState(() {
        _isLoading = true;
      });
      tempKinds = await Provider.of<PlantProvider>(context, listen: false)
          .getPlantKinds();
      await Provider.of<PlantProvider>(context, listen: false)
          .getPlants(tempKinds[0]);
      setState(() {
        plantTypes = tempKinds;
        _isLoading = false;
        selectedKind = plantTypes[0];
        _isInit = true;
      });
    }

    super.didChangeDependencies();
  }

  ///Method to refresh the dataset
  Future<void> _refreshPlants(BuildContext context) {
    return Provider.of<PlantProvider>(context, listen: false)
        .getPlants(selectedKind);
  }

  @override
  Widget build(BuildContext context) {
    final plantData = Provider.of<PlantProvider>(context, listen: true);
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("Plants"),
        actions: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: IconButton(
              icon: Icon(Icons.refresh),
              onPressed: () => _refreshPlants(context),
            ),)
        ],
      ),
      drawer: AppDrawer(),
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                valueColor: new AlwaysStoppedAnimation<Color>(Colors.green),
              ),
            )
          : Column(
                children: [
                  Expanded(
                    flex: 1,
                    child: Row(children: [
                      Expanded(
                        flex: 9,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            height: 50,
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                isExpanded: true,
                                value: selectedKind,
                                icon: Icon(Icons.arrow_drop_down),
                                underline: Container(
                                  height: 2,
                                  color: Colors.blue,
                                ),
                                items: plantTypes.map<DropdownMenuItem<String>>(
                                    (String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Text(value,
                                        overflow: TextOverflow.ellipsis),
                                  );
                                }).toList(),
                                onChanged: (String? newValue) {
                                  if (newValue != null) {
                                    setState(() {
                                      selectedKind = newValue;
                                    });
                                  }
                                  Provider.of<PlantProvider>(context,
                                          listen: false)
                                      .getPlants(selectedKind);
                                },
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 1,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: ElevatedButton(
                            child: Text("Export dataset"),
                            style: ElevatedButton.styleFrom(
                              primary: Colors.green
                            ),
                            onPressed: (){
                              Provider.of<PlantProvider>(context, listen: false).exportPlantToFile();
                              print("Export");
                            },
                          ),
                        ))
                    ]),
                  ),
                  Divider(),
                  Expanded(
                    flex: 19,
                    child: Row(children: [
                      plantData.plants.length > 0
                            ? Expanded(
                                child: ListView.builder(
                                    itemCount: plantData.plants.length,
                                    itemBuilder: (_, i) {
                                      return PlantItem(
                                        plant: plantData.plants[i],
                                      );
                                    }),
                              )
                            : Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Center(
                                  child: Text(
                                    "Geen planten om weer te geven.",
                                    textAlign: TextAlign.center,
                                    maxLines: 10,
                                  ),
                                ),
                              ),
                    ]),
                  )
                ],
              
            ),
      bottomNavigationBar: Container(
          height: 40,
          color: Colors.green,
          child: Center(
            child: Text(
              "© 2021 Avans Hogeschool",
              style: TextStyle(color: Colors.white),
            ),
          )),
    );
  }
}
