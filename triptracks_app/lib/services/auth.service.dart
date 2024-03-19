import 'package:triptracks_app/common/constants.common.dart';
import 'package:triptracks_app/models/user.model.dart';
import 'package:triptracks_app/services/helpers/network.helper.dart';

class AuthService {
  late NetworkHelper networkHelper;

  AuthService() {
    networkHelper = NetworkHelper(UrlConstants.backendBaseUrl);
  }

  User? login() {
    return const User(
      name: "Ashish",
      email: "shetty073@gmail.com",
      password: "abcd@1234",
    );
  }

  User? register(User user) {
    return User(
      name: user.name,
      email: user.email,
    );
  }
}
