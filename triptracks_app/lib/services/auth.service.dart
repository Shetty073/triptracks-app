import 'package:get/get.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/common/enums.common.dart';
import 'package:triptracks_app/models/user.model.dart';
import 'package:triptracks_app/services/helpers/network.helper.dart';
import 'package:triptracks_app/widgets/popups/pop_snack.widget.dart';

class AuthService {
  late NetworkHelper networkHelper;

  AuthService() {
    networkHelper = NetworkHelper(UrlConstants.backendBaseUrl);
  }

  Future<User?> login(String email, password) async {
    try {
      // var payload = {"email": email, "password": password};
      var payload = {
        "title": 'foo',
        "body": 'bar',
        "userId": 1,
      };

      var response = await networkHelper.request(
          UrlConstants.login, HttpMethod.post, payload);

      if (response["title"] == "foo") {
        return const User(email: "shetty073@gmail.com", name: "Ashish Shetty");
      } else {
        return null;
      }
    } catch (e) {
      e.printError();
      popSnack(
        title: "Error Processing Request",
        message: e.toString().replaceAll("Exception: ", ""),
        isError: true,
      );
      return null;
    }
  }

  Future<User?> register(User user) async {
    try {
      // var payload = {"name": user.name, "email": user.email, "password": user.password};
      var payload = {
        "title": 'foo',
        "body": 'bar',
        "userId": 1,
      };

      var response = await networkHelper.request(
          UrlConstants.register, HttpMethod.post, payload);

      if (response["title"] == "foo") {
        return User(
          name: user.name,
          email: user.email,
        );
      } else {
        return null;
      }
    } catch (e) {
      e.printError();
      popSnack(
        title: "Error Processing Request",
        message: e.toString().replaceAll("Exception: ", ""),
        isError: true,
      );
      return null;
    }
  }
}
