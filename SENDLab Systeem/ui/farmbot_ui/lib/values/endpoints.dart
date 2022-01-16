
///Class to hold the different API endpoints.
///
///Makes it more easy to perform endpoint changes.
class EndPoints{

  //URL of API
  static const String baseUrl = "http://127.0.0.1:3000";
  static const String baseUrlWithout = "127.0.0.1:3000";
  
  //Endpoint to start camera sequence
  static const String dataSequence = baseUrl + "/datasequence";

  //Endpoint to start water sequence
  static const String waterSequence = baseUrl + "/watersequence";

  //Get available plants
  static const String getTypes = baseUrl + "/Plant/type";

  //Get data of plant type
  static const String getPlantByType = "/plant/plant_type";

  //Endpoint to get image
  static const String getImage = baseUrl + "/image/";
}