Title: How can I allow authenticated users to send only as themselves?
Date: 2026-10-13 10:00:00
Category: snippets
Description: Perl filter snippet that rejects sender/login mismatches like Postfix reject_sender_login_mismatch, using $SendmailMacros{auth_authen} in filter_sender.
Tags: Authentication
Num: 021
Status: published

A client authenticated as `user@example.com` must use `user@example.com` as envelope sender,
while unauthenticated clients cannot use addresses of local domains, the same behavior as
Postfix `reject_sender_login_mismatch`.
The check is done in `filter_sender`, so `mimedefang` must be started with the `-s` flag;
mail injected from `127.0.0.1` is skipped, like `permit_mynetworks` placed before it.

    my %local_domains = map { $_ => 1 } qw(example.com example.net);

    sub filter_sender {
        my($sender, $ip, $hostname, $helo) = @_;
        read_commands_file();

        my $login = lc($SendmailMacros{auth_authen} // '');
        (my $addr = lc($sender)) =~ s/^<|>$//g;
        return ('CONTINUE', 'ok') if $addr eq '' or $ip eq '127.0.0.1';
        my ($domain) = $addr =~ /\@(.+)$/;

        if ($login ne '' and $login ne $addr) {
            return ('REJECT', "Authenticated as $login, not allowed to send as $addr");
        }
        if ($login eq '' and $domain and $local_domains{$domain}) {
            return ('REJECT', "Authentication required to send as $addr");
        }
        return ('CONTINUE', 'ok');
    }
