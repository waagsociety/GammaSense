#!/bin/sh
set -e

# Flush all
iptables -F

# ACCEPT ALL loopback traffic
iptables -A INPUT -i lo -j ACCEPT

# ACCEPT current/established connections
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

############### CUSTOMIZE YOUR RULES #################
# ACCEPT incoming SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# ACCEPT incoming HTTP
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# ACCEPT incoming HTTPS
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

if [ "${1} " != " " ]
then
# ACCEPT app requests
  iptables -A INPUT -p tcp --dport ${1} -j ACCEPT
fi
#####################################################

# Default INPUT AND FORWARD to DROP
iptables -P INPUT DROP
iptables -P FORWARD DROP

# Default OUTPUT to ACCEPT
iptables -P OUTPUT ACCEPT

# Save rules
iptables-save > /etc/iptables/rules.v4
ip6tables-save >/etc/iptables/rules.v6
