Ruby
========

Installs Ruby and bundler.
Add permissions for deploy user (if present).

Installation
--------------

`ansible-galaxy install palkan.ruby`

Role Variables
--------------

`defaults/main.yml`

| Name                        | Default Value |  Description    |
|-----------------------------|---------------|-----------------|
| ruby_version              | 2.2        | Ruby version to install |
| ruby_url                  | "http://cache.ruby-lang.org/pub/ruby/{{ ruby_version }}/{{ ruby_name }}.tar.gz" | Source tar url | 
| ruby_name                 | ruby-2.2.2 | Ruby source name |
| ruby_tmp_path             | "/usr/local/src/{{ ruby_name }}" | Where to download source | 


Example Playbook
-------------------------
```yml
  - hosts: servers
    roles:
       - palkan.ruby
```
