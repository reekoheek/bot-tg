FROM debian:7

MAINTAINER Ganesha <reekoheek@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# echo "Acquire::http { Proxy \"http://192.168.1.10:3142\"; };" > /etc/apt/apt.conf.d/02proxy && \
# echo "# deb http://kambing.ui.ac.id/debian/ wheezy-updates" >> /etc/apt/sources.list && \

RUN \
    echo "deb http://kambing.ui.ac.id/debian/ wheezy main" > /etc/apt/sources.list && \
    echo "deb http://kambing.ui.ac.id/debian-security/ wheezy/updates main" >> /etc/apt/sources.list && \
    apt-get update -y && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup | bash - && \
    apt-get install -y \
        gcc \
        nodejs \
        libreadline-dev \
        libconfig-dev \
        libssl-dev \
        lua5.2 \
        liblua5.2-dev \
        libevent-dev \
        git \
        unzip \
        make \
        wget

ADD root/ /

# RUN cd /tmp && \
#     wget http://luarocks.org/releases/luarocks-2.2.0.tar.gz && \
#     tar -xzvf luarocks-2.2.0.tar.gz && \
#     cd luarocks-2.2.0/ && \
#     ./configure && \
#     make && make install && \
#     luarocks install oauth && \
#     luarocks install luasocket

RUN cd /tg && \
    ./configure && make
