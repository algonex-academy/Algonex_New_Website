from rest_framework.exceptions import APIException
from rest_framework import status


class UserNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "No account found with this email."
    default_code = "USER_NOT_FOUND"


class TermsNotAgreed(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "You must agree to the terms and conditions."
    default_code = "TERMS_NOT_AGREED"


class InvalidRegistrationToken(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Your registration session is invalid or has expired. Please start again."
    default_code = "INVALID_REGISTRATION_TOKEN"
