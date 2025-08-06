#!/bin/sh
unset CDPATH

# Install dcc
curl -L https://github.com/COMP1511UNSW/dcc/releases/download/2.37/dcc_2.37_all.deb \
         -o /tmp/dcc.deb \
 && apt-get install -y --no-install-recommends /tmp/dcc.deb \
 && rm /tmp/dcc.deb

# Install dcc-help
cd "$(dirname "$0")" || exit 1
chmod 711 .
mkdir -p -m 711 lib
chmod 755 lib/*


cd lib || exit 1
ln -sf explain dcc-help
ln -sf helper dcc-compile-helper
ln -sf helper dcc-runtime-helper
