Title: How can I convert winmail.dat TNEF attachments to their original content?
Date: 2021-07-19 08:51:23
Category: snippets
Num: 003
Status: published

To convert all attached winmail.dat TNEF attachments to their original content you can use the following code in your filter:  

    sub filter {
      my($entity, $fname, $ext, $type) = @_;

      if (lc($type) eq "application/ms-tnef" or lc($fname) eq "winmail.dat" ) {
        use Convert::TNEF;
        use File::Type;
        use File::Temp qw(tempfile tempdir);

        my $tnefdir = tempdir(CLEANUP => 1, DIR => "/tmp");
        my $tnef = Convert::TNEF->read_ent($entity,{output_dir=>"$tnefdir"});

        my $ft = File::Type->new();

        for ($tnef->attachments) {
             my $mimetype = $ft->mime_type($_->data);

             my $tnef_entity = action_add_part($entity, "$mimetype", "base64", $_->data, $_->longname, "attachment");
             md_graphdefang_log('tnef_ext', "File: " . $_->longname . " Type: $mimetype");

             filter ($tnef_entity, $_->longname, "", "$mimetype");
        }
        $tnef->purge;
        return action_drop();
      }
      return action_accept();
    }
