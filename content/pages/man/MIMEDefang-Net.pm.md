Title: Mail::MIMEDefang::Net(3) - man page
Description: Mail::MIMEDefang::Net are a set of methods that can be called from mimedefang-filter(5) to call network related services.
Author: gbechis
Slug: man_Mail::MIMEDefang::Net
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Net - Network related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Net are a set of methods that can be called
from `mimedefang-filter` to call network related services.

# METHODS

- expand\_ipv6\_address

    Method that returns an IPv6 address with all zero fields explicitly expanded,
    any field shorter than 4 hex digits will be padded with zeros.

- reverse\_ip\_address\_for\_rbl

    Method that returns the ip address in the appropriately-reversed format used
    for RBL lookups.

- relay\_is\_blacklisted

    Method that returns the result of the lookup (eg 127.0.0.2).
    Parameters are the ip address of the relay host and the domain of the
    rbl server.

- email\_is\_blacklisted

    Method that returns the result of the lookup (eg 127.0.0.2).
    Parameters are an email address, the domain of the
    hashbl server, and the type of hashing (MD5 or SHA1).

- is\_public\_ip4\_address $ip\_addr

    Returns true if $ip\_addr is a publicly-routable IPv4 address, false otherwise

- is\_public\_ip6\_address $ip\_addr

    Returns true if $ip\_addr is a publicly-routable IPv6 address, false otherwise

- get\_mx\_ip\_addresses $domain \[$resolver\_object\]

    Get IP addresses of all MX hosts for given domain.  If there are
    no MX hosts, then return A records.

- md\_get\_bogus\_mx\_hosts $domain

    Returns a list of "bogus" IP addresses that are in $domain's list of MX
    records.  A "bogus" IP address is loopback/private/multicast/etc.

- get\_ptr\_record $ip\_address \[$resolver\_object\]

    Get PTR record for given IP address.

- md\_get\_dmarc\_record $domain

    Returns the DMARC record of a domain.

- relay\_is\_blacklisted\_multi

    Method that rerurns a hash table with one entry per original domain.
    Entries in hash will be:
    `{ $domain =<gt` $return }>, where $return is one of SERVFAIL, NXDOMAIN or
    a list of IP addresses as a dotted-quad.

- relay\_is\_blacklisted\_multi\_count

    Method that returns a number indicating how many RBLs the host
    was blacklisted in.

- relay\_is\_blacklisted\_multi\_list

    Method that returns an array indicating the domains in which
    the relay is blacklisted.

- md\_dns\_txt($resolver, $name)

    Query `$name` for TXT records using the supplied `Net::DNS::Resolver`
    object and return the first TXT string found, or `undef` on any error
    (NXDOMAIN, SERVFAIL, no TXT records).
