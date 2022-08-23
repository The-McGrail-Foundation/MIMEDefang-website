Title: MIMEDefang - documentation
Date: 2022-08-24 00:00:24
Author: gbechis
Slug: man_Mail::MIMEDefang::DKIM
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::DKIM - DKIM interface for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::DKIM is a module with a set of DKIM related methods
called from *mimedefang-filter* to operate with DKIM.

# METHODS

md_dkim_sign

:   Returns a mail header and the DKIM signature for the message. The
    method accepts the following parameters:

    \$keyfile

    :   The path to the private DKIM key

    \$algorithm

    :   The algorithm to be used to sign the message, by default is
        \'rsa-sha1\'

    \$method

    :   The method used to sign the message, by default is \'relaxed\'

    \$domain

    :   The domain to be used when signing the message, by default it\'s
        autodetected

    \$selector

    :   The selector to be used when signing the message, by default
        it\'s \'default\'

    \$headers

    :   The headers to sign, by default the headers are: From Sender
        Reply-To Subject Date Message-ID To Cc MIME-Version Content-Type
        Content-Transfer-Encoding Content-ID Content-Description
        Resent-Date Resent-From Resent-Sender Resent-To Resent-cc
        Resent-Message-ID In-Reply-To References List-Id List-Help
        List-Unsubscribe List-Subscribe List-Post List-Owner
        List-Archive

md_dkim_verify

:   Verifies the DKIM signature of an email. Return value can be pass,
    fail, invalid, temperror, none. In case of multiple signatures, the
    best result will be returned. Best is defined as pass, followed by
    fail, invalid, and none. The second return value is the domain that
    has applied the signature. The third return value is the size of the
    DKIM public key. The forth return value is the value of the b tag of
    the DKIM signature.
