import 'package:triptracks_app/common/constants.common.dart';

String? emailValidator(String? email) {
  final bool validEmailPattern =
      RegExp(RegexConstants.emailPatternRegex).hasMatch(email ?? "");

  if (!validEmailPattern) {
    return ErrorMessageConstants.emailInvalid;
  }

  final bool validDomain =
      RegExp(RegexConstants.emailDomainRegex).hasMatch(email ?? "");

  if (!validDomain) {
    return ErrorMessageConstants.emailDomainInvalid;
  }

  return null;
}

String? passwordValidator(String? password) {
  final bool validEmailPattern =
      RegExp(RegexConstants.passwordPatternRegex).hasMatch(password ?? "");

  if (!validEmailPattern) {
    return ErrorMessageConstants.emailInvalid;
  }

  return null;
}
