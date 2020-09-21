<?php

    $sp_entityId    = 'SP_ENTITY_ID';
    $idp_entityId   = 'IDP_ENTITY_ID';
    $cert           = 'YOUR_CERTIFICATE';
    $login_link     = 'YOUR_LOGIN_LINK';
    $logout_link    = 'YOUR_LOGOUT_LINK';


    $spBaseUrl = 'https://'.$_SERVER['HTTP_HOST'] ;
   
    $settingsInfo = array (
        'sp' => array (
          'entityId' => $sp_entityId,
          
            'assertionConsumerService' => array (
               'url' => 'https://'.$_SERVER['HTTP_HOST'] .'/sso/index.php?acs',
            ),
            'singleLogoutService' => array (
                'url' => 'https://'.$_SERVER['HTTP_HOST'] .'/sso/index.php?slo',
            ),
            'NameIDFormat' => 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
        ),
        'idp' => array (
            'entityId' => $idp_entityId,
            'singleSignOnService' => array (
                'url' => $login_link,
            ),
            'singleLogoutService' => array (
                'url' => $logout_link,
            ),
            'x509cert' => $cert,
        ),
    );
 





