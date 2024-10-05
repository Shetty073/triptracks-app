import 'package:get/get.dart';
import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/common/enums.common.dart';
import 'package:triptracks_app/models/user.model.dart';
import 'package:triptracks_app/services/helpers/network.helper.dart';
import 'package:triptracks_app/services/secure_storage.service.dart';
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
        "email": email,
        "password": password
      };

      var response = await networkHelper.request(
          UrlConstants.login, HttpMethod.post, payload);

      if (response != null && response["success"] == true) {
        var data = response["data"];
        var userData = data["user"];
        String token = data["token"];

        await SecureStorageService.instance.saveKey('token', token);

        return User(
          id: userData["id"],
          email: userData["email"],
          firstName: userData["first_name"],
          lastName: userData["last_name"],
          userName: userData["username"]
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

  Future<bool?> register(User user) async {
    try {
      var payload = {
        "first_name": user.firstName,
        "last_name": user.lastName,
        "email": user.email,
        "password": user.password,
        "password_confirm": user.confirmPassword
      };

      var response = await networkHelper.request(
          UrlConstants.register, HttpMethod.post, payload);

      if (response != null && response["success"] == true) {
        return true;

      } else {
        return false;

      }

    } catch (e) {
      e.printError();
      e.printInfo();
      popSnack(
        title: "Error Processing Request",
        message: e.toString().replaceAll("Exception: ", ""),
        isError: true,
      );
      return false;

    }

  }

}
