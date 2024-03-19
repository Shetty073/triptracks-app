class RegexConstants {
  static const String emailPatternRegex =
      r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$";
  static const String emailDomainRegex =
      r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$";
  static const String passwordPatternRegex =
      r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$';
}

class ErrorMessageConstants {
  static const String emailInvalid = "Please enter a valid email address";
  static const String emailDomainInvalid =
      "Supported domains: gmail.com, outlook.com, yahoo.com, icloud.com, aol.com, protonmail.com, zoho.com, gmx.com, yandex.com, mail.com";
}

class UrlConstants {
  static const String backendBaseUrl = "https://jsonplaceholder.typicode.com";
}
