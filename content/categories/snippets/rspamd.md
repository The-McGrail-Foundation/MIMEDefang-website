Title: How can I use rspamd to detect spam messages ?
Date: 2022-08-07 18:27:50
Category: snippets
Num: 004
Status: published

To use rspamd to detect spam messages you can use the following code in your filter:  

     my ($hits, $req, $names, $report, $action, $is_spam) = rspamd_check();
     md_syslog("Warning", "Action: $action, Spam: $is_spam, Names: $names");
     if ($is_spam eq "true") {
       action_change_header("X-Spam-Score", "$hits/$req $names");
       md_syslog("Warning", "Action: $action");
       md_graphdefang_log('spam', $hits, $RelayAddr);
     } else {
       # Delete any existing X-Spam-Score header?
       action_delete_header("X-Spam-Score");
     }
