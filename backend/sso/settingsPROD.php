<?php

    $spBaseUrl = 'https://portail-babel.groupe-bel.com/BFS'; 

    $settingsInfo = array (
        'sp' => array (
          'entityId' => $spBaseUrl.'/saml/metadata.php',
		  
            'assertionConsumerService' => array (
               'url' => $spBaseUrl.'/saml/index.php?acs',
		    ),
            'singleLogoutService' => array (
                'url' => $spBaseUrl.'/saml/index.php?slo',
            ),
            'NameIDFormat' => 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
        ),
        'idp' => array (
            'entityId' => 'https://sts.windows.net/b426991c-4e11-4b97-8cdd-a962846b0120/',
            'singleSignOnService' => array (
                'url' => 'https://login.microsoftonline.com/b426991c-4e11-4b97-8cdd-a962846b0120/saml2',
            ),
            'singleLogoutService' => array (
                'url' => 'https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0',
            ),
            'x509cert' => 'MIIC8DCCAdigAwIBAgIQW+dQtJUF6JtBxytmtgzTqzANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0xODAyMDgxNzIyNTRaFw0yMTAyMDgxNzIyNTNaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApaBEecmgf+Ho3iTQinZnbVpP6i8cvQHpgvUaR7VjLW1yjHgUvMhd3CC9FpMOm6NbOQL8kyJKN9MmjV8FE78ri3KOt1v4tYusGysmBYsyHvVTHHP0Lpu8fh/M+VYnxqT+G1cPou+aqOOxxCt+EJVN4kVB/IyZjKD2eLPwxPc9ULRxeI7AQxxjKYGw31MfREjtpjhINORjCFDG+ZmbdBh7v1TMgXxkZYSV/2SEwaz6cXa8K/Yhco5tEhZiu7aufupk28LRNeodMRU69fmAB21xwnMICwsAnSCPJQQUSpNxoK+LMtmuzdLeOAKpve44xZ5QBGD/r6FhOYEAW70qc0fXPwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAij0Ggre4J0t5T/u9Nqim7X8pg90QMT12z6fyViepvhFMTnLr32HRL4sR2SZVJekkeYgQFpsI1udE/UxTGHYDBpTvD0u0c2JEXLhcypxgRYTaC/1ZgINDKBeyfOvl9CaJpvY17l9j1XTBwrZhG3O7DiZRS8l1h8E9Qh9fae/YIcwfZzoZ8qxqOqOy0fVUR7JJNBJsis8K5mbyZmb7TbwUY5VTijXEkxMnk5cemWy3K1Sw6RzAxElrrMrUkLCQK5nQDlNnBQhuPqt+dRstQYuKRjegu9Smi3MayXvA6r9hIzxQzsSTSaXOCl2cQ88iEYUHlVpzS1bnXMnaOzcg3++jz',
        ),
    );
