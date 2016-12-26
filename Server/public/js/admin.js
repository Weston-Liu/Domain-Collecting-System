! function (d, V) {
    'use strict'

    !self.fetch && console.error('fetch API is not supported, please upgrade the browser.');

    fetch('/api/public/domain', {
        credentials: 'include'
    }).then((res) => {
        return res.json().then((json) => {
            for (let entry of json) {
                entry.status = entry.cTime == entry.vTime;
            }
            vm.domains = json;
            d.querySelectorAll('input[type="checkbox"]').forEach((e) => {
                vm.checked.push(e.getAttribute('value'))
            })
        });
    });

    var vm = new V({
        el: '.container',
        data: {
            domains: [],
            checked: [],
            input: ''
        },
        methods: {
            download: function (e) {

                fetch('api/public/xlsx', {
                        method: 'post',
                        body: JSON.stringify(this.filteredDomain),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (res) {
                        return res.blob();
                    })
                    .then(function (blob) {
                        var link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'Domains.xlsx';
                        link.click();
                        URL.revokeObjectURL(link.href);
                    });
            },
            add: function (e) {

                if (!confirm(`This operation will add the following domain(s) to ${this.checked.length} site(s), continue?\n\n` + this.input.replace(/\,/g, '\n'))) return;

                fetch('/api/public/domain', {
                    credentials: 'include',
                    method: 'put',
                    body: JSON.stringify({
                        sites: this.checked,
                        domains: this.input.split(',').map((e) => {
                            return e.replace(/(^\s*)|(\s*$)/g, '')
                        })
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        location.reload();
                    } else {
                        alert('At least one of your domain already exists in the database, please check your input.');
                    }
                });
            },
            changePass: function (e) {
                // @TODO: Change Password
            }
        },
        computed: {
            filteredDomain: function () {
                return this.domains.filter((e, i, a) => {
                    if (vm.checked.indexOf(e.sid + '') > -1)
                        return e;
                });
            },
            hasWarning: function () {
                return this.checked.length > 1;
            },
            hasDanger: function () {
                return this.checked.length === 0 || !/^([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4})(,([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4}))*$/.test(this.input);
            },
            warnInfo: function () {
                return this.checked.length > 1 ? `Attention: You are adding domain to ${this.checked.length} sites. ` : '';
            },
            errorInfo: function () {
                return this.hasDanger ?
                    (this.checked.length === 0 ? 'Error: Please choose a targeted site.' : 'Error: Domain format  error.') : '';
            },
            validated: function () {
                return !this.warnInfo && !this.errorInfo;
            }
        }
    });

}(document, Vue)