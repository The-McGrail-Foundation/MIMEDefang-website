Title: Mail::MIMEDefang::Net(3) - man page
Description: Mail::MIMEDefang::Net are a set of methods that can be called from mimedefang-filter(5) to call network related services.
Author: gbechis
Slug: man_Mail::MIMEDefang::Net
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Net - Network related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Net are a set of methods that can be called from
*mimedefang-filter* to call network related services.

# METHODS

expand_ipv6_address

:   Method that returns an IPv6 address with all zero fields explicitly
    expanded, any field shorter than 4 hex digits will be padded with
    zeros.

reverse_ip_address_for_rbl

:   Method that returns the ip address in the appropriately-reversed
    format used for RBL lookups.

relay_is_blacklisted

:   Method that returns the result of the lookup (eg 127.0.0.2).
    Parameters are the ip address of the relay host and the domain of
    the rbl server.

email_is_blacklisted

:   Method that returns the result of the lookup (eg 127.0.0.2).
    Parameters are an email address, the domain of the hashbl server,
    and the type of hashing (MD5 or SHA1).

is_public_ip4_address $ip_addr

:   Returns true if `$ip_addr` is a publicly-routable IPv4 address,
    false otherwise

is_public_ip6_address $ip_addr

:   Returns true if `$ip_addr` is a publicly-routable IPv6 address,
    false otherwise

get_mx_ip_addresses $domain \[$resolver_object\]

:   Get IP addresses of all MX hosts for given domain. If there are no
    MX hosts, then return A records.

md_get_bogus_mx_hosts $domain

:   Returns a list of bogus IP addresses that are in `$domain`\'s list
    of MX records. A bogus IP address is loopback/private/multicast/etc.

get_ptr_record $ip_address \[$resolver_object\]

:   Get PTR record for given IP address.

relay_is_blacklisted_multi

:   Method that rerurns a hash table with one entry per original domain.
    Entries in hash will be: `{ $domain =>` `$return }`, where
    `$return` is one of SERVFAIL, NXDOMAIN or a list of IP addresses as
    a dotted-quad.

relay_is_blacklisted_multi_count

:   Method that returns a number indicating how many RBLs the host was
    blacklisted in.

relay_is_blacklisted_multi_list

:   Method that returns an array indicating the domains in which the
    relay is blacklisted.
