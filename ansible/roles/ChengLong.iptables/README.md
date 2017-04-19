ChengLong.iptables
=========

Ansible role to setup basic iptables rules. You *SHOULD* edit the rules in `files/basic_iptables_rules.sh` to fit your needs.
This role does the following:

1. Install iptables and iptables-persistent
2. ACCEPT all loopback traffic
3. ACCEPT current/established connections
4. ACCEPT incoming SSH
5. ACCEPT incoming HTTP
6. ACCEPT incoming HTTPS
7. Default INPUT and FORWARD to DROP
8. Default OUTPUT to ACCEPT
9. Save rules to /etc/iptables/rules.v4
10. Restart iptables-persistent. The rules will be re-applied on server restart!

Requirements
------------

NONE

Role Variables
--------------

NONE

Dependencies
------------

NONE

Example Playbook
----------------

```
- hosts: servers
  roles:
     - ChengLong.iptables
  become: yes
```

License
-------

MIT

Author Information
------------------

[Cheng Long](https://twitter.com/ChengLong_)
