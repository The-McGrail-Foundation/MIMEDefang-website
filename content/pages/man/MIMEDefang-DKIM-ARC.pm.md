Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_Mail::MIMEDefang::DKIM::ARC
Status: published
Template: documentation

NAME
    Mail::MIMEDefang::DKIM::ARC - ARC interface for MIMEDefang

DESCRIPTION
    Mail::MIMEDefang::DKIM::ARC is a module with a set of ARC related
    methods called from mimedefang-filter to operate with ARC signatures.

METHODS
    md_arc_sign
        Returns an hash with mail headers and the ARC signature for the
        message. If ARC sign fails the hash will contain an error message.
        The method accepts the following parameters:

        $keyfile
            The path to the private ARC key

        $algorithm
            The algorithm to be used to sign the message, by default is
            'rsa-sha256'

        $chain
            The cv= value for the Arc-Seal header. "ar" means to copy it
            from an Authentication-Results header, or use none if there
            isn't one.

        $domain
            The domain to be used when signing the message.

        $srvid
            The authserv-id in the Authentication-Results headers, defaults
            to Domain.

        $selector
            The selector to be used when signing the message, by default
            it's 'default'

        $headers
            The headers to sign, by default the headers are: From Sender
            Reply-To Subject Date Message-ID To Cc MIME-Version Content-Type
            Content-Transfer-Encoding Content-ID Content-Description
            Resent-Date Resent-From Resent-Sender Resent-To Resent-cc
            Resent-Message-ID In-Reply-To References List-Id List-Help
            List-Unsubscribe List-Subscribe List-Post List-Owner
            List-Archive
