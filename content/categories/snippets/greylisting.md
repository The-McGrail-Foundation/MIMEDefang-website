Title: How can I implement greylisting ?
Date: 2024-07-30 12:54:09
Category: snippets
Num: 005
Status: published

In order to use use greylisting you should add this code tou your filter:  

    my $dbh;
    sub filter_initialize {
        my($entity) = @_;

        $dbh = DBI->connect($dsn, $username, $auth, {RaiseError => 1});
    }

    sub filter_recipient {
        my ($recipient, $sender, $ip, $hostname, $first, $helo,
            $rcpt_mailer, $rcpt_host, $rcpt_addr) = @_;

        my $ip_address = $ip;

        # Greylist all the /24 subnet
        #
        # my @ip = split(/\./, $ip);
        # $ip_address = $ip[0] . '.' . $ip[1] . '.' . $ip[2] . '.0';

        my $ret = Mail::MIMEDefang::Actions::action_greylist($dbh, $sender, $recipient, $ip_address);
        if($ret eq "tempfail") {
          return('TEMPFAIL', "Email greylisted, please come back later");
        } elsif($ret eq "reject") {
          return('REJECT', "Go away or deliver email faster");
        } else {
          return ('CONTINUE', "ok");
        }
    }

     sub filter_cleanup {
       $dbh->disconnect();
     }

A sample database schema is available in the contrib/greylisting directory.
