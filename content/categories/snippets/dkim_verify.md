Title: How can I verify a DKIM signature ?
Date: 2021-07-19 08:51:23
Category: snippets
Num: 002
Status: published

To verify a DKIM signature you can use the following code in your filter:  

    use Mail::MIMEDefang::DKIM;  
    my ($result, $domain, $keysize, $btag) = md_dkim_verify();  
    if($result eq "pass") {  
      ...  
    }
