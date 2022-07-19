Title: How can I DKIM sign an e-mail?
Date: 2021-07-19 08:51:23
Category: snippets
Num: 001
Status: published

To DKIM sign an email you can use the following code in your filter:  

    use Mail::MIMEDefang::DKIM;  
    my ($header, $value) = md_dkim_sign('domain-dkim.key.pem', 'rsa-sha256', 'relaxed/simple', $sender_domain, 'dkim');  
    action_insert_header($header, $value);
