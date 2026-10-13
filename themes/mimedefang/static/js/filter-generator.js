/*
 * MIMEDefang filter generator
 *
 * Builds a mimedefang-filter from the options chosen in the form on
 * /filter-generator/.  Everything runs in the browser.
 */
(function () {
  'use strict';

  var DEFAULT_BAD_EXTS = 'ade adp app asd asf asx bas bat chm cmd com cpl crt dll exe fxp hlp hta hto inf ini ins isp js jse lib lnk mdb mde msc msi msp mst ocx pcd pif prg reg scr sct sh shb shs sys url vb vbe vbs vcs vxd wmd wms wmz wsc wsf wsh';

  var DEFAULTS = {
    // General
    admin_address: 'postmaster@example.com',
    admin_name: 'MIMEDefang Administrator',
    daemon_address: 'mimedefang@example.com',
    warnings_inline: false,
    graphdefang: true,
    syslog_facility: 'mail',
    max_mime_parts: '',
    max_scan_kb: '512',
    suspicious_chars: 'quarantine',
    trusted_networks: '127.0.0.1 ::1',

    // Antispam
    antispam: 'spamassassin',
    sa_mode: 'local',
    sa_local_tests_only: false,
    spamd_host: '127.0.0.1',
    spamd_port: '783',
    rspamd_uri: 'http://127.0.0.1:11333',
    rspamd_follow_action: true,
    spam_action: 'header',
    spam_subject_prefix: '[SPAM]',
    spam_reject_score: '15',
    spam_attach_report: false,

    // Antivirus
    antivirus: 'clamd',
    clamd_sock: '/var/spool/MIMEDefang/clamd.sock',
    virus_action: 'discard',
    virus_paranoid: false,
    virus_tempfail: true,

    // Attachments
    attach_enable: true,
    bad_exts: DEFAULT_BAD_EXTS,
    block_clsid: true,
    inspect_zip: true,
    block_partial: true,
    attach_action: 'drop',
    rebuild: false,

    // Authentication
    spf: false,
    spf_action: 'header',
    dkim_verify: false,
    authres: false,
    server_domain: 'mx.example.com',
    dkim_sign: false,
    dkim_key: '/etc/mail/dkim/example.com.key.pem',
    dkim_selector: 'default',
    dkim_domain: '',
    dkim_algorithm: 'rsa-sha256',
    dkim_method: 'relaxed/relaxed',

    // SMTP-time checks
    rbl: false,
    rbl_zones: 'zen.spamhaus.org bl.spamcop.net',
    rbl_threshold: '1',
    rbl_timeout: '10',
    helo_check: false,
    greylist: false,
    greylist_dsn: 'dbi:SQLite:dbname=/var/spool/MIMEDefang/greylist.db',
    greylist_user: '',
    greylist_pass: '',
    greylist_min: '300',
    greylist_max: '14400',
    greylist_subnet: false,
    rcpt_verify: false,
    rcpt_server: 'mailstore.example.com'
  };

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */

  // Single-quoted Perl string literal
  function perlStr(s) {
    return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }

  // Double-quoted Perl string: text must be static, so escape interpolation
  function perlDq(s) {
    return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      .replace(/\$/g, '\\$').replace(/@/g, '\\@') + '"';
  }

  function num(v, def) {
    var n = parseFloat(v);
    return isFinite(n) ? n : def;
  }

  function int(v, def) {
    var n = parseInt(v, 10);
    return isFinite(n) && n >= 0 ? n : def;
  }

  function words(s) {
    return String(s || '').split(/[\s,;]+/).filter(function (w) { return w.length; });
  }

  function reEscape(s) {
    return s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  }

  function perlList(list) {
    return '(' + list.map(perlStr).join(', ') + ')';
  }

  function indent(lines, n) {
    var pad = new Array(n + 1).join(' ');
    return lines.map(function (l) { return l.length ? pad + l : l; });
  }

  function banner(title) {
    return [
      '#***********************************************************************',
      '# ' + title,
      '#***********************************************************************'
    ];
  }

  function normalize(opts) {
    var s = {};
    var k;
    for (k in DEFAULTS) {
      if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) {
        s[k] = (opts && Object.prototype.hasOwnProperty.call(opts, k)) ? opts[k] : DEFAULTS[k];
      }
    }
    return s;
  }

  // Which optional pieces are in use, derived from the options
  function features(s) {
    var f = {};
    f.trusted = words(s.trusted_networks).length > 0 &&
      (s.dkim_sign || s.rbl || s.helo_check || s.greylist || s.spf);
    f.spam = s.antispam !== 'none';
    f.virus = s.antivirus !== 'none';
    f.quarantine = (s.suspicious_chars === 'quarantine') ||
      (f.virus && s.virus_action === 'quarantine') ||
      (s.attach_enable && s.attach_action === 'quarantine') ||
      (f.spam && s.spam_action === 'quarantine');
    f.relay = s.rbl;
    f.helo = s.helo_check;
    f.recipient = s.greylist || s.rcpt_verify;
    f.bad_filename = s.attach_enable && (words(s.bad_exts).length > 0 || s.block_clsid);
    return f;
  }

  /* ------------------------------------------------------------------ */
  /* Section builders                                                   */
  /* ------------------------------------------------------------------ */

  function genHeader(s) {
    return [
      '# -*- Perl -*-',
      '#***********************************************************************',
      '#',
      '# mimedefang-filter',
      '#',
      '# Generated by the MIMEDefang filter generator',
      '# https://mimedefang.org/filter-generator/',
      '#',
      '# Review this file, save it as /etc/mail/mimedefang-filter.new and',
      '# check it before installing it:',
      '#   mimedefang.pl -f /etc/mail/mimedefang-filter.new -test',
      '# It must print "... seems syntactically correct."; only then move it',
      '# to /etc/mail/mimedefang-filter and reload MIMEDefang.',
      '#',
      '# generator-options: ' + JSON.stringify(s),
      '#***********************************************************************',
      ''
    ];
  }

  function genModules(s) {
    var l = [];
    if (s.spf) l.push('use Mail::MIMEDefang::SPF;');
    if (s.dkim_verify || s.dkim_sign) l.push('use Mail::MIMEDefang::DKIM;');
    if (s.authres) l.push('use Mail::MIMEDefang::Authres;');
    if (s.greylist) l.push('use DBI;');
    if (l.length) l.push('');
    return l;
  }

  function genGlobals(s, f) {
    var l = [];
    l = l.concat(banner('Administrator and notification addresses'));
    l.push('$AdminAddress = ' + perlStr(s.admin_address) + ';');
    l.push('$AdminName = ' + perlStr(s.admin_name) + ';');
    l.push('$DaemonAddress = ' + perlStr(s.daemon_address) + ';');
    l.push('');
    l.push('# Add warnings inline in the text/html parts instead of a WARNING.TXT part');
    l.push('$AddWarningsInline = ' + (s.warnings_inline ? 1 : 0) + ';');
    l.push('');
    if (int(s.max_mime_parts, 0) > 0) {
      l.push('# Reject messages with too many MIME parts');
      l.push('$MaxMIMEParts = ' + int(s.max_mime_parts, 0) + ';');
      l.push('');
    }
    if (s.antispam === 'spamassassin' && s.sa_mode === 'local') {
      l.push('# 1 disables SpamAssassin network tests (RBL, URIBL, Razor, ...)');
      l.push('$SALocalTestsOnly = ' + (s.sa_local_tests_only ? 1 : 0) + ';');
      l.push('');
    }
    if (s.antivirus === 'clamd') {
      l.push('# clamd socket: a Unix socket path or host:port');
      l.push('$ClamdSock = ' + perlStr(s.clamd_sock) + ';');
      l.push('');
    }
    if (s.graphdefang) {
      l.push('# Log virus/spam/attachment events in a format graphdefang can parse');
      l.push('md_graphdefang_log_enable(' + perlStr(s.syslog_facility || 'mail') + ', 1);');
      l.push('');
    }
    l.push('$Stupidity{"NoMultipleInlines"} = 0;');
    l.push('');
    l.push('# Detect and load Perl modules');
    l.push('detect_and_load_perl_modules();');
    l.push('');
    if (f.trusted) {
      l.push('# Networks treated as internal: SMTP checks are skipped and');
      l.push('# outgoing mail is DKIM signed.  Prefixes or full addresses.');
      l.push('my @TrustedNetworks = ' + perlList(words(s.trusted_networks)) + ';');
      l.push('');
    }
    if (s.rbl) {
      l.push('my @RBLZones = ' + perlList(words(s.rbl_zones)) + ';');
      l.push('');
    }
    if (s.greylist) {
      l.push('# Greylisting database');
      l.push('my $GreylistDSN = ' + perlStr(s.greylist_dsn) + ';');
      l.push('my $GreylistUser = ' + perlStr(s.greylist_user) + ';');
      l.push('my $GreylistPass = ' + perlStr(s.greylist_pass) + ';');
      l.push('my $dbh;');
      l.push('');
    }
    return l;
  }

  function genHelpers(s, f) {
    var l = [];
    if (f.trusted) {
      l = l.concat(banner('is_trusted: true if the IP address belongs to @TrustedNetworks'));
      l.push('sub is_trusted {');
      l.push('    my ($ip) = @_;');
      l.push('    return 0 unless defined $ip;');
      l.push('    $ip =~ s/^\\[|\\]$//g;');
      l.push('    foreach my $net (@TrustedNetworks) {');
      l.push('        return 1 if $ip eq $net;');
      l.push('        my $prefix = $net;');
      l.push('        $prefix =~ s/\\/\\d+$//;');
      l.push('        $prefix =~ s/(?:\\.0)+$/./;');
      l.push('        return 1 if ($prefix =~ /[.:]$/ and index($ip, $prefix) == 0);');
      l.push('    }');
      l.push('    return 0;');
      l.push('}');
      l.push('');
    }
    if (f.bad_filename) {
      var exts = words(s.bad_exts).map(function (e) { return reEscape(e.replace(/^\./, '')); });
      var alts = exts.slice();
      if (s.block_clsid) alts.push('\\{[^\\}]+\\}');
      l = l.concat(banner('filter_bad_filename: true for attachments with dangerous names'));
      l.push('sub filter_bad_filename {');
      l.push('    my ($entity) = @_;');
      l.push('');
      l.push("    my $bad_exts = '(" + alts.join('|') + ")';");
      l.push('');
      l.push('    # Bad extensions, possibly followed by trailing dots');
      l.push("    my $re = '\\.' . $bad_exts . '\\.*$';");
      l.push('    return 1 if re_match($entity, $re);');
      if (s.inspect_zip) {
        l.push('');
        l.push('    # Look inside ZIP files');
        l.push("    if (re_match($entity, '\\.zip$') and $Features{\"Archive::Zip\"}) {");
        l.push('        my $bh = $entity->bodyhandle();');
        l.push('        if (defined($bh)) {');
        l.push('            my $path = $bh->path();');
        l.push('            return re_match_in_zip_directory($path, $re) if defined($path);');
        l.push('        }');
        l.push('    }');
      }
      l.push('    return 0;');
      l.push('}');
      l.push('');
    }
    return l;
  }

  function genInitCleanup(s) {
    var l = [];
    if (!s.greylist) return l;
    l = l.concat(banner('filter_initialize / filter_cleanup: open and close the greylist DB'));
    l.push('sub filter_initialize {');
    l.push('    $dbh = DBI->connect($GreylistDSN, $GreylistUser, $GreylistPass,');
    l.push('                        { RaiseError => 0, PrintError => 0, AutoCommit => 1 });');
    l.push("    md_syslog('err', \"Cannot connect to greylist database: $DBI::errstr\") unless $dbh;");
    l.push('}');
    l.push('');
    l.push('sub filter_cleanup {');
    l.push('    $dbh->disconnect() if $dbh;');
    l.push('}');
    l.push('');
    return l;
  }

  function genSmtpCallbacks(s, f) {
    var l = [];
    var skip = f.trusted ? ['    return (\'CONTINUE\', \'ok\') if is_trusted($ip);', ''] : [];

    if (f.relay) {
      l = l.concat(banner('filter_relay: called at connect time (start mimedefang with -r)'));
      l.push('sub filter_relay {');
      l.push('    my ($ip, $name) = @_;');
      l.push('');
      l = l.concat(skip);
      l.push('    my $listed = relay_is_blacklisted_multi_count($ip, ' + int(s.rbl_timeout, 10) + ', ' +
        int(s.rbl_threshold, 1) + ', \\@RBLZones);');
      l.push('    if ($listed >= ' + int(s.rbl_threshold, 1) + ') {');
      l.push("        md_graphdefang_log('rbl', $listed, $ip);");
      l.push("        return ('REJECT', \"Your IP address $ip is listed in $listed DNS blocklist(s)\");");
      l.push('    }');
      l.push("    return ('CONTINUE', 'ok');");
      l.push('}');
      l.push('');
    }

    if (f.helo) {
      l = l.concat(banner('filter_helo: called after HELO/EHLO (start mimedefang with -H)'));
      l.push('sub filter_helo {');
      l.push('    my ($ip, $name, $helo) = @_;');
      l.push('');
      l = l.concat(skip);
      l.push("    if (!defined($helo) or $helo eq '') {");
      l.push("        return ('REJECT', 'A HELO/EHLO hostname is required');");
      l.push('    }');
      l.push('    if ($helo =~ /^(localhost|localhost\\.localdomain)$/i) {');
      l.push("        return ('REJECT', \"Bogus HELO $helo\");");
      l.push('    }');
      l.push('    # A bare IP address is only allowed as an address literal: [1.2.3.4]');
      l.push('    if ($helo =~ /^\\d+\\.\\d+\\.\\d+\\.\\d+$/) {');
      l.push("        return ('REJECT', \"Bare IP address in HELO $helo, use [$helo]\");");
      l.push('    }');
      l.push('    if ($helo !~ /\\./ and $helo !~ /^\\[.*\\]$/) {');
      l.push("        return ('REJECT', \"HELO $helo is not a fully qualified domain name\");");
      l.push('    }');
      l.push("    return ('CONTINUE', 'ok');");
      l.push('}');
      l.push('');
    }

    if (f.recipient) {
      l = l.concat(banner('filter_recipient: called for each RCPT TO (start mimedefang with -t)'));
      l.push('sub filter_recipient {');
      l.push('    my ($recipient, $sender, $ip, $hostname, $first, $helo,');
      l.push('        $rcpt_mailer, $rcpt_host, $rcpt_addr) = @_;');
      l.push('');
      if (s.rcpt_verify) {
        l.push('    # Ask the downstream server whether the recipient exists');
        l.push('    my ($result, $msg) = md_check_against_smtp_server($sender, $recipient,');
        l.push('                                                      get_host_name(), ' + perlStr(s.rcpt_server) + ');');
        l.push("    return ($result, $msg) if ($result eq 'REJECT' or $result eq 'TEMPFAIL');");
        l.push('');
      }
      if (s.greylist) {
        l = l.concat(skip);
        l.push('    return (\'CONTINUE\', \'ok\') unless $dbh;');
        l.push('    my $ip_address = $ip;');
        if (s.greylist_subnet) {
          l.push('    # Greylist the whole /24 so senders with a pool of outgoing MTAs pass');
          l.push('    $ip_address =~ s/\\.\\d+$/.0/ if $ip_address =~ /^\\d+\\.\\d+\\.\\d+\\.\\d+$/;');
        }
        l.push('    my $ret = action_greylist($dbh, $sender, $recipient, $ip_address, ' +
          int(s.greylist_min, 300) + ', ' + int(s.greylist_max, 14400) + ');');
        l.push("    if ($ret eq 'tempfail') {");
        l.push("        return ('TEMPFAIL', 'Greylisted, please try again later');");
        l.push("    } elsif ($ret eq 'reject') {");
        l.push("        return ('REJECT', 'Greylisting retry window expired');");
        l.push('    }');
      }
      l.push("    return ('CONTINUE', 'ok');");
      l.push('}');
      l.push('');
    }
    return l;
  }

  function genVirusCheck(s) {
    var l = [];
    var call;
    if (s.antivirus === 'clamd') call = 'message_contains_virus_clamd()';
    else if (s.antivirus === 'clamdscan') call = 'message_contains_virus_clamdscan()';
    else call = 'message_contains_virus()';

    l.push('    # Virus scan');
    if (s.antivirus === 'auto') {
      l.push('    # Copy the original message into the work directory as an mbox file');
      l.push('    md_copy_orig_msg_to_work_dir_as_mbox_file();');
    }
    l.push('    my ($code, $category, $action) = ' + call + ';');
    if (s.virus_paranoid) {
      l.push('    # Treat anything the scanner flags for quarantine as a virus');
      l.push("    my $found_virus = ($action eq 'quarantine' or $category eq 'virus');");
    } else {
      l.push("    my $found_virus = ($category eq 'virus');");
    }
    l.push('    if ($found_virus) {');
    l.push("        md_graphdefang_log('virus', $VirusName, $RelayAddr);");
    if (s.virus_action === 'bounce') {
      l.push("        md_syslog('warning', \"Bouncing because of virus $VirusName\");");
      l.push('        return action_bounce("Virus $VirusName found in message");');
    } else if (s.virus_action === 'quarantine') {
      l.push("        md_syslog('warning', \"Quarantining because of virus $VirusName\");");
      l.push('        action_quarantine_entire_message("Virus $VirusName found in message");');
      l.push('        return action_discard();');
    } else {
      l.push("        md_syslog('warning', \"Discarding because of virus $VirusName\");");
      l.push('        return action_discard();');
    }
    l.push('    }');
    if (s.virus_tempfail) {
      l.push("    if ($action eq 'tempfail') {");
      l.push("        md_syslog('warning', \"Problem running virus scanner: code=$code, category=$category, action=$action\");");
      l.push('        return action_tempfail("Problem running virus scanner");');
      l.push('    }');
    }
    l.push('');
    return l.map(function (x) { return x.replace(/^ {4}/, ''); });
  }

  function genFilterBegin(s, f) {
    var l = [];
    var body = [];

    if (s.suspicious_chars !== 'ignore') {
      body.push('# Suspicious characters in headers can be used to evade filters');
      body.push('if ($SuspiciousCharsInHeaders) {');
      body.push("    md_graphdefang_log('suspicious_chars');");
      if (s.suspicious_chars === 'quarantine') {
        body.push('    action_quarantine_entire_message("Message quarantined because of suspicious characters in headers");');
        body.push('    return action_discard();');
      } else {
        body.push('    return action_tempfail("Message has suspicious characters in headers");');
      }
      body.push('}');
      body.push('');
    }

    if (s.spf) {
      body.push('# SPF check');
      body.push('my ($spf_result, $spf_expl) = md_spf_verify($Sender, $RelayAddr, $Helo);');
      body.push('$spf_result //= \'none\';');
      if (f.trusted) body.push('unless (is_trusted($RelayAddr)) {');
      var spf = [];
      if (s.spf_action === 'reject') {
        spf.push("if ($spf_result eq 'fail') {");
        spf.push("    md_graphdefang_log('spf_fail', $Sender, $RelayAddr);");
        spf.push('    return action_bounce("SPF check failed: $spf_expl");');
        spf.push('}');
      }
      if (!s.authres) {
        spf.push("action_change_header('X-SPF-Result', $spf_result);");
      }
      body = body.concat(f.trusted ? indent(spf, 4) : spf);
      if (f.trusted) body.push('}');
      body.push('');
    }

    if (s.authres) {
      body.push('# Authentication-Results header (SPF and DKIM)');
      body.push('my $authres = md_authres($Sender, $RelayAddr, ' + perlStr(s.server_domain) + ', $Helo);');
      body.push("action_insert_header('Authentication-Results', $authres) if defined $authres;");
      body.push('');
    } else if (s.dkim_verify) {
      body.push('# DKIM verification');
      body.push('my ($dkim_result, $dkim_domain) = md_dkim_verify();');
      body.push('if (defined $dkim_result) {');
      body.push("    action_change_header('X-DKIM-Result',");
      body.push("        $dkim_result . (defined($dkim_domain) ? \" (d=$dkim_domain)\" : ''));");
      body.push('}');
      body.push('');
    }

    if (f.virus) body = body.concat(genVirusCheck(s));

    while (body.length && body[body.length - 1] === '') body.pop();
    if (!body.length) return l;

    l = l.concat(banner('filter_begin: called once before the parts are processed'));
    l.push('sub filter_begin {');
    l.push('    my ($entity) = @_;');
    l.push('');
    l = l.concat(indent(body, 4));
    l.push('}');
    l.push('');
    return l;
  }

  function attachmentAction(s, what) {
    var msg = 'An attachment named $fname was removed from this message as it\\n' +
      'constituted a security hazard.  If you require this document, please contact\\n' +
      'the sender and arrange an alternate means of receiving it.\\n';
    switch (s.attach_action) {
      case 'defang':
        return ['return action_defang($entity, \'\', \'\', \'\');'];
      case 'quarantine':
        return ['action_quarantine($entity, "' + what + ' $fname was quarantined.\\n");',
                'return action_drop_with_warning("' + msg + '");'];
      case 'bounce':
        return ['return action_bounce("' + what + ' $fname is not accepted here");'];
      default:
        return ['return action_drop_with_warning("' + msg + '");'];
    }
  }

  function genFilter(s, f) {
    var l = [];
    l = l.concat(banner('filter: called for each leaf MIME part'));
    l.push('sub filter {');
    l.push('    my ($entity, $fname, $ext, $type) = @_;');
    l.push('');
    l.push('    return if message_rejected(); # Avoid unnecessary work');
    l.push('');
    if (s.attach_enable && s.block_partial) {
      l.push('    if (lc($type) eq "message/partial") {');
      l.push("        md_graphdefang_log('message/partial');");
      l.push('        return action_bounce("MIME type message/partial not accepted here");');
      l.push('    }');
      l.push('');
    }
    if (f.bad_filename) {
      l.push('    if (filter_bad_filename($entity)) {');
      l.push("        md_graphdefang_log('bad_filename', $fname, $type);");
      l = l.concat(indent(attachmentAction(s, 'An attachment named'), 8));
      l.push('    }');
      l.push('');
    }
    l.push('    return action_accept();');
    l.push('}');
    l.push('');

    l = l.concat(banner('filter_multipart: called for multipart container parts'));
    l.push('sub filter_multipart {');
    l.push('    my ($entity, $fname, $ext, $type) = @_;');
    l.push('');
    l.push('    return if message_rejected();');
    l.push('');
    if (f.bad_filename) {
      l.push('    if (filter_bad_filename($entity)) {');
      l.push("        md_graphdefang_log('bad_filename', $fname, $type);");
      l.push('        action_notify_administrator("A MULTIPART attachment of type $type, named $fname was dropped.\\n");');
      l = l.concat(indent(attachmentAction(s, 'A multipart attachment named'), 8));
      l.push('    }');
      l.push('');
    }
    if (s.attach_enable && s.block_partial) {
      l.push('    if (lc($type) eq "message/partial") {');
      l.push("        md_graphdefang_log('message/partial');");
      l.push('        return action_bounce("MIME type message/partial not accepted here");');
      l.push('    }');
      l.push('');
    }
    l.push('    return action_accept();');
    l.push('}');
    l.push('');

    if (s.attach_enable && s.attach_action === 'defang') {
      l = l.concat(banner('defang_warning: text of the warning added when a part is defanged'));
      l.push('sub defang_warning {');
      l.push('    my ($oldfname, $fname) = @_;');
      l.push('    return "An attachment named \'$oldfname\' was converted to \'$fname\'.\\n" .');
      l.push('        "To recover the file, right-click on the attachment and Save As\\n" .');
      l.push('        "\'$oldfname\'\\n";');
      l.push('}');
      l.push('');
    }
    return l;
  }

  function spamVerdict(s) {
    // Lines run inside "if ($is_spam) { ... }"; $hits, $req, $names, $report set
    var l = [];
    var subjectTag = function () {
      return ['action_change_header(\'Subject\', ' + perlStr(s.spam_subject_prefix + ' ') + ' . $Subject);'];
    };
    l.push("md_graphdefang_log('spam', $hits, $RelayAddr);");
    if (s.spam_action === 'subject') {
      l = l.concat(subjectTag());
    } else if (s.spam_action === 'quarantine') {
      l.push('action_quarantine_entire_message("Message quarantined as spam (score $hits)");');
      l.push('return action_discard();');
    } else if (s.spam_action === 'reject') {
      l.push('if ($hits >= ' + num(s.spam_reject_score, 15) + ') {');
      l.push('    return action_bounce("Message rejected as spam");');
      l.push('}');
    }
    if (s.spam_attach_report && s.spam_action !== 'quarantine') {
      l.push('action_add_part($entity, "text/plain", "-suggest", "$report\\n",');
      l.push('                "SpamReport.txt", "inline");');
    }
    return l;
  }

  function genSpamCheck(s) {
    var l = [];
    var kb = int(s.max_scan_kb, 512);
    var inner = [];

    if (s.antispam === 'spamassassin' && s.sa_mode === 'local') {
      inner.push('if ($Features{"SpamAssassin"}) {');
      inner.push('    my ($hits, $req, $names, $report) = spam_assassin_check();');
      inner.push('    my $is_spam = (defined($hits) and $hits >= $req);');
      inner.push('    if (defined $hits) {');
      inner.push("        action_change_header('X-Spam-Score', \"$hits / $req \" . ($names // ''));");
      inner.push("        action_change_header('X-Spam-Status', $is_spam ? 'Yes' : 'No');");
      inner.push('    }');
      inner.push('    if ($is_spam) {');
      inner = inner.concat(indent(spamVerdict(s), 8));
      inner.push('    }');
      inner.push('}');
    } else if (s.antispam === 'spamassassin') {
      inner.push('# spamd/spamc client mode (SpamAssassin 4.0.1+)');
      inner.push('my $sa_client = md_spamc_init(' + perlStr(s.spamd_host) + ', ' + int(s.spamd_port, 783) + ');');
      inner.push('my ($hits, $req, $report, $is_spam) = md_spamc_check($sa_client);');
      inner.push("my $names = '';");
      inner.push('if (defined $hits) {');
      inner.push("    action_change_header('X-Spam-Score', \"$hits / $req\");");
      inner.push("    action_change_header('X-Spam-Status', $is_spam ? 'Yes' : 'No');");
      inner.push('    if ($is_spam) {');
      inner = inner.concat(indent(spamVerdict(s), 8));
      inner.push('    }');
      inner.push('}');
    } else if (s.antispam === 'rspamd') {
      inner.push('my ($hits, $req, $names, $report, $rs_action, $rs_spam) = rspamd_check(' + perlStr(s.rspamd_uri) + ');');
      inner.push('if (defined $hits) {');
      inner.push("    my $is_spam = ($rs_spam eq 'true');");
      inner.push("    action_change_header('X-Spam-Score', \"$hits / $req\");");
      inner.push("    action_change_header('X-Spam-Status', $is_spam ? 'Yes' : 'No');");
      inner.push("    action_change_header('X-Spam-Action', $rs_action) if defined $rs_action;");
      if (s.rspamd_follow_action) {
        inner.push('    # Apply the action decided by Rspamd');
        inner.push("    if ($rs_action eq 'reject') {");
        inner.push("        md_graphdefang_log('spam', $hits, $RelayAddr);");
        inner.push('        return action_bounce("Message rejected as spam");');
        inner.push("    } elsif ($rs_action eq 'soft reject') {");
        inner.push('        return action_tempfail("Please try again later");');
        if (s.spam_action !== 'subject') {
          // With spam_action 'subject' the verdict below already tags it
          inner.push("    } elsif ($rs_action eq 'rewrite subject') {");
          inner.push("        action_change_header('Subject', " + perlStr(s.spam_subject_prefix + ' ') + ' . $Subject);');
        }
        inner.push('    }');
      }
      inner.push('    if ($is_spam) {');
      inner = inner.concat(indent(spamVerdict(s), 8));
      inner.push('    }');
      inner.push('}');
    }

    l.push('# Spam check, only on messages smaller than ' + kb + ' KB:');
    l.push('# large messages are rarely spam and are slow to scan');
    l.push('if (-s "./INPUTMSG" < ' + kb + ' * 1024) {');
    l = l.concat(indent(inner, 4));
    l.push('}');
    return l;
  }

  function genFilterEnd(s, f) {
    var l = [];
    var body = [];
    if (f.spam) {
      if (f.trusted) {
        body.push('# Do not spam check mail from trusted networks');
        body.push('unless (is_trusted($RelayAddr)) {');
        body = body.concat(indent(genSpamCheck(s), 4));
        body.push('}');
        body.push('');
      } else {
        body = body.concat(genSpamCheck(s));
        body.push('');
      }
    }
    if (s.attach_enable && s.rebuild) {
      body.push('# Rebuild every message as clean MIME to defeat malformed MIME tricks');
      body.push('action_rebuild();');
      body.push('');
    }
    if (s.dkim_sign) {
      body.push('# DKIM sign ' + (f.trusted ? 'mail relayed from trusted networks' : 'every message'));
      if (f.trusted) body.push('if (is_trusted($RelayAddr)) {');
      var sign = [];
      var dom = s.dkim_domain ? perlStr(s.dkim_domain) : 'undef';
      sign.push('my ($header, $value) = md_dkim_sign(' + perlStr(s.dkim_key) + ', ' +
        perlStr(s.dkim_algorithm) + ', ' + perlStr(s.dkim_method) + ',');
      sign.push('                                    ' + dom + ', ' + perlStr(s.dkim_selector) + ');');
      sign.push('action_insert_header($header, $value) if defined $header;');
      body = body.concat(f.trusted ? indent(sign, 4) : sign);
      if (f.trusted) body.push('}');
      body.push('');
    }

    if (body.length) {
      l = l.concat(banner('filter_end_checks: spam check and final changes, called by filter_end'));
      l.push('sub filter_end_checks {');
      l.push('    my ($entity) = @_;');
      l.push('');
      l = l.concat(indent(body, 4));
      l.push('    return;');
      l.push('}');
      l.push('');
    }

    l = l.concat(banner('filter_end: called once after all the parts are processed'));
    l.push('sub filter_end {');
    l.push('    my ($entity) = @_;');
    l.push('');
    if (body.length) {
      l.push('    filter_end_checks($entity) unless message_rejected();');
      l.push('');
    }
    if (f.quarantine) {
      l.push('    # Mail a quarantine report to the administrator.  This must run after');
      l.push('    # anything that quarantines parts or the whole message, and only once.');
      l.push('    send_quarantine_notifications();');
      l.push('');
    }
    if (s.graphdefang) {
      l.push("    md_graphdefang_log('mail_in') unless message_rejected();");
    }
    l.push('    return;');
    l.push('}');
    l.push('');
    return l;
  }

  function generate(opts) {
    var s = normalize(opts);
    var f = features(s);
    var l = [];
    l = l.concat(genHeader(s));
    l = l.concat(genModules(s));
    l = l.concat(genGlobals(s, f));
    l = l.concat(genHelpers(s, f));
    l = l.concat(genInitCleanup(s));
    l = l.concat(genSmtpCallbacks(s, f));
    l = l.concat(genFilterBegin(s, f));
    l = l.concat(genFilter(s, f));
    l = l.concat(genFilterEnd(s, f));
    l.push('# DO NOT delete the next line, or Perl will complain.');
    l.push('1;');
    return l.join('\n') + '\n';
  }

  // Daemon flags and Perl modules needed by the chosen options
  function requirements(opts) {
    var s = normalize(opts);
    var f = features(s);
    var flags = [];
    var mods = ['MIME::Tools', 'MailTools'];
    if (f.relay) flags.push('-r (filter_relay)');
    if (f.helo) flags.push('-H (filter_helo)');
    if (f.recipient) flags.push('-t (filter_recipient)');
    if (s.antispam === 'spamassassin') mods.push(s.sa_mode === 'local' ? 'Mail::SpamAssassin' : 'Mail::SpamAssassin::Client (SpamAssassin 4.0.1+)');
    if (s.antispam === 'rspamd') mods.push('JSON', 'LWP::UserAgent');
    if (s.antivirus === 'clamd') mods.push('IO::Socket::UNIX / IO::Socket::INET');
    if (s.attach_enable && s.inspect_zip && f.bad_filename) mods.push('Archive::Zip');
    if (s.spf || s.authres) mods.push('Mail::SPF');
    if (s.dkim_verify || s.dkim_sign || s.authres) mods.push('Mail::DKIM');
    if (s.rbl) mods.push('Net::DNS');
    if (s.greylist) mods.push('DBI + DBD driver for ' + (String(s.greylist_dsn).split(':')[1] || 'your database'));
    if (s.rcpt_verify) mods.push('IO::Socket::SSL');
    var svc = [];
    if (s.antispam === 'spamassassin' && s.sa_mode === 'spamd') svc.push('spamd on ' + s.spamd_host + ':' + s.spamd_port);
    if (s.antispam === 'rspamd') svc.push('rspamd on ' + s.rspamd_uri);
    if (s.antivirus === 'clamd') svc.push('clamd listening on ' + s.clamd_sock);
    if (s.antivirus === 'clamdscan') svc.push('clamd + clamdscan binary in $PATH');
    if (s.greylist) svc.push('greylist table (see contrib/greylisting/*.sql)');
    return { flags: flags, modules: mods, services: svc };
  }

  /* ------------------------------------------------------------------ */
  /* Browser UI                                                         */
  /* ------------------------------------------------------------------ */

  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function collect() {
    var s = {};
    $all('#fg-form [name]').forEach(function (el) {
      if (el.type === 'checkbox') s[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) s[el.name] = el.value; }
      else s[el.name] = el.value;
    });
    return normalize(s);
  }

  function apply(s) {
    s = normalize(s);
    $all('#fg-form [name]').forEach(function (el) {
      var v = s[el.name];
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.type === 'radio') el.checked = (el.value === v);
      else el.value = v;
    });
  }

  function toggleDeps(s) {
    $all('[data-show]').forEach(function (el) {
      var cond = el.getAttribute('data-show').split('=');
      var name = cond[0];
      var vals = (cond[1] || 'true').split('|');
      var v = s[name];
      var on = vals.some(function (x) {
        if (x === 'true') return v === true;
        if (x === 'false') return v === false;
        return v === x;
      });
      el.hidden = !on;
    });
  }

  function renderReq(s) {
    var r = requirements(s);
    var out = [];
    function list(title, items) {
      if (!items.length) return;
      out.push('<p class="fg-req-title">' + title + '</p><ul>');
      items.forEach(function (i) {
        out.push('<li>' + i.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</li>');
      });
      out.push('</ul>');
    }
    list('mimedefang command-line flags', r.flags);
    list('Perl modules', r.modules);
    list('Services', r.services);
    $('#fg-req').innerHTML = out.join('');
  }

  var hashTimer;
  function update() {
    var s = collect();
    toggleDeps(s);
    $('#fg-output').textContent = generate(s);
    renderReq(s);
    clearTimeout(hashTimer);
    hashTimer = setTimeout(function () {
      try {
        history.replaceState(null, '', '#' + encodeURIComponent(JSON.stringify(diff(s))));
      } catch (e) { /* ignore */ }
    }, 300);
  }

  // Only store options that differ from the defaults in the URL
  function diff(s) {
    var d = {};
    Object.keys(s).forEach(function (k) { if (s[k] !== DEFAULTS[k]) d[k] = s[k]; });
    return d;
  }

  function flash(btn, text) {
    var old = btn.textContent;
    btn.textContent = text;
    setTimeout(function () { btn.textContent = old; }, 1500);
  }

  function init() {
    var form = $('#fg-form');
    if (!form) return;

    var initial = {};
    if (location.hash.length > 1) {
      try { initial = JSON.parse(decodeURIComponent(location.hash.slice(1))); } catch (e) { initial = {}; }
    }
    apply(initial);

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    $('#fg-copy').addEventListener('click', function () {
      var btn = this;
      var text = $('#fg-output').textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () { flash(btn, 'Copied'); },
          function () { flash(btn, 'Copy failed'); });
      } else {
        flash(btn, 'Copy failed');
      }
    });

    $('#fg-download').addEventListener('click', function () {
      var blob = new Blob([$('#fg-output').textContent], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mimedefang-filter';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    });

    $('#fg-reset').addEventListener('click', function () {
      apply({});
      update();
    });

    $('#fg-import').addEventListener('click', function () {
      var text = $('#fg-import-text').value;
      var m = text.match(/generator-options:\s*(\{.*\})/);
      var msg = $('#fg-import-msg');
      try {
        apply(JSON.parse(m ? m[1] : text));
        update();
        msg.textContent = 'Options loaded.';
      } catch (e) {
        msg.textContent = 'No generator-options line found.';
      }
    });

    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
