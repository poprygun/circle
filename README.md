# API Troubleshooting:

Dear Satoshi, 

Below please find the steps that I used to debug and address the error you experienced while posting Create Card request to Circle API.

- As per [Circle API documentation](https://developers.circle.com/reference/payments-cards-create), the "idempotencyKey" must be a valid UUID v4. I obtained a new random value using https://www.uuidgenerator.net/guid.
- Json is not well formatted - missing closing "}".  Used https://jsonformatter.curiousconcept.com/ to debug.
- "encryptedData" element is malformed, perhaps containing an empty space or carriage return.  Used https://jsonformatter.curiousconcept.com/ to identify the issue and https://www.browserling.com/tools/join-lines to format sanitize "encryptedData" value.
- Upon the submission of addressed issues, I received validation error message:
{"code":1101,"message":"Invalid entity.\nbillingAddress.country is not a valid ISO 31660-2 country code","errors":[{"error":"invalid_value","invalidValue":"USA","location":"billingAddress.country","message":"billingAddress.country is not a valid ISO 31660-2 country code"}].  Changed location field value "USA" -> "US".
- {"code":1094,"message":"Last name can not be empty"}.  Changed name field value "Satoshi" -> "Satoshi Nakamoto".
- {"code":2,"message":"Invalid phone number '2025550180', format should be in E.164."}.  Changed phoneNumber field value "2025550180" -> "+2025550180".
- Upon the correcting the errors, your corrected request should look like below:

```bash
curl --location --request POST 'https://api-sandbox.circle.com/v1/cards' \
--header "Authorization: Bearer $YOUR_API_KEY" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
   "idempotencyKey":"ba943ff1-ca16-49b2-ba55-1057e70ca5c7",
   "expMonth":1,
   "expYear":2025,
   "keyId":"key1",
   "encryptedData":"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFmOUdIMlRLSjNPdlpHSzhPdXNKaFZKbktWWmkyME4wcmkvbkVoRFNoK04NCldSd1hRbldNcCs0SzFwQVF0YnUwa0JQUzZWSjM0dVZUUHVRUUtIN01GQUlGeENVRkVJRDRNVHN0ajI1ag0KcjNGcXgxdE9JMGl4YzBYbVVJcVJZZmxKTm1sZnZETjFZWmhzTzlYcElWUVdES0xaKzlSOXZ1ZWZiSm15DQpuQkdubnlTMHZ0Vld3dGNmMGh4U3N6bWYxZEpiSk5WUnRxd1NaS1RpbTloUytJeE9YRHB2KzVqWGVKeTUNCnl5NUxpb3RvUnB0RW5LZ1IxNEd4cW1Fd2lETVFKWGFDM2E0QmdJZGdxN205cHNHTm5Sbk1TdU9HNXdDWQ0KRjdRQU94RXdKREhCRHJHY3BldFo4QnBZVzVZbDNCM3lRYlJESklZd3VLQnVYVXZHdWRpTWtnK095cVRVDQplZEpoQWJtWkZDWXhIeUtDMFphamxLWFhLTE9WTDY3MThXcWQ4SzBPUzg2Z05LRTVLM29VVTFPMkF5SjgNCnlQV21SQ001TSt2RWNtTUpVd0w0OXAwZzRMVnUvcTNDRDRpWWpvandJNExpS3NBYXRYcmczNUdWVk8wcQ0KVFFRMWZPaWozcnpWZ0E9PQ0KPXA2aU0NCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg==",
   "billingDetails":{
      "name":"Satoshi Nakamoto",
      "country":"US",
      "district":"MA",
      "line1":"Test",
      "line2":"",
      "city":"Test City",
      "postalCode":"11111"
   },
   "metadata":{
      "email":"customer-0001@circle.com",
      "phoneNumber":"+2025550180",
      "sessionId":"xxx",
      "ipAddress":"172.33.222.1"
   }
}'
```

Response data identifies the card id `48d7d8eb-b74f-4250-940d-75520259e193`:

```
{"data":{"id":"48d7d8eb-b74f-4250-940d-75520259e193","status":"pending","last4":"0007","billingDetails":{"name":"Satoshi Nakamoto","line1":"Test","city":"Test City","postalCode":"11111","district":"MA","country":"US"},"expMonth":1,"expYear":2025,"network":"VISA","bin":"400740","issuerCountry":"ES","fundingType":"debit","fingerprint":"603b2185-1901-4eae-9b98-cc20c32d0709","verification":{"cvv":"pending","avs":"pending"},"createDate":"2022-07-20T19:01:35.258Z","metadata":{"phoneNumber":"+2025550180","email":"customer-0001@circle.com"},"updateDate":"2022-07-20T19:01:35.258Z"}}
```

Can be further verified by accessing card details using cards API:

```bash
curl --request GET \
     --url https://api-sandbox.circle.com/v1/cards/48d7d8eb-b74f-4250-940d-75520259e193 \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $YOUR_API_KEY"
```

Response

```
{"data":{"id":"48d7d8eb-b74f-4250-940d-75520259e193","status":"complete","last4":"0007","billingDetails":{"name":"Satoshi Nakamoto","line1":"Test","city":"Test City","postalCode":"11111","district":"MA","country":"US"},"expMonth":1,"expYear":2025,"network":"VISA","bin":"400740","issuerCountry":"ES","fundingType":"debit","fingerprint":"603b2185-1901-4eae-9b98-cc20c32d0709","verification":{"cvv":"pass","avs":"Y"},"createDate":"2022-07-20T19:01:35.258Z","metadata":{"phoneNumber":"+2025550180","email":"customer-0001@circle.com"},"updateDate":"2022-07-20T19:01:36.966Z"}}
```

Crypt on,

Alex

## References

[Create a card API](https://developers.circle.com/reference/payments-cards-create)

[Json Formatter](https://jsonformatter.curiousconcept.com/)

[GUID Generator](https://www.uuidgenerator.net/guid)

[Sanitize Multi Lines](https://www.browserling.com/tools/join-lines)
