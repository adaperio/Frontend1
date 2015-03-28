if (typeof ijQuery == "undefined") {
    ijQuery = jQuery
}
ijQuery(document).ready(function () {
    ijQuery.validator.addMethod("checkdefaultvalue", function (b, a) {
        if (ijQuery(a).hasClass("required")) {
            return(b != ijQuery(a).attr("default_value"))
        } else {
            return true
        }
    }, "Please fill this field.");
    ijQuery.extend(ijQuery.validator.messages, {required: function () {
        return _Translate.get("This field is required.")
    }, remote: function () {
        return _Translate.get("Please fix this field.")
    }, email: function () {
        return _Translate.get("Please enter a valid email address.")
    }, url: function () {
        return _Translate.get("Please enter a valid URL.")
    }, date: function () {
        return _Translate.get("Please enter a valid date.")
    }, dateISO: function () {
        return _Translate.get("Please enter a valid date (ISO).")
    }, number: function () {
        return _Translate.get("Please enter a valid number.")
    }, digits: function () {
        return _Translate.get("Please enter only digits.")
    }, creditcard: function () {
        return _Translate.get("Please enter a valid credit card number.")
    }, equalTo: function () {
        return _Translate.get("Please enter the same value again.")
    }, accept: function () {
        return _Translate.get("Please enter a value with a valid extension.")
    }, maxlength: ijQuery.validator.format(function () {
        return _Translate.get("Please enter no more than {0} characters.")
    }), minlength: ijQuery.validator.format(function () {
        return _Translate.get("Please enter at least {0} characters.")
    }), rangelength: ijQuery.validator.format(function () {
        return _Translate.get("Please enter a value between {0} and {1} characters long.")
    }), range: ijQuery.validator.format(function () {
        return _Translate.get("Please enter a value between {0} and {1}.")
    }), max: ijQuery.validator.format(function () {
        return _Translate.get("Please enter a value less than or equal to {0}.")
    }), min: ijQuery.validator.format(function () {
        return _Translate.get("Please enter a value greater than or equal to {0}.")
    })});
    ijQuery(".email-form").each(function () {
        var a = $(this).find('input[name="thank-you-message"]') ? $(this).find('input[name="thank-you-message"]').val() : false;
        ijQuery(this).validate({ignore: "", errorPlacement: function (b, c) {
            b.appendTo(c.parent().parent())
        }, submitHandler: function () {
            try {
                ijQuery(".notification").show();
                ijQuery(".notification-inner").css("left", ((ijQuery(window).width() - ijQuery(".notification-inner").width()) / 2) + "px");
                ijQuery(".notification .loading").show();
                ijQuery(".notification .message").html(_Translate.get("Processing..."));
                var f = this.currentForm;
                ijQuery(f).find("input").each(function () {
                    if (!ijQuery(this).hasClass("required") && ijQuery(this).attr("default_value") == ijQuery(this).val()) {
                        ijQuery(this).remove()
                    }
                });
                var h = {};
                h.ajax = true;
                h.fields = ijQuery(f).serializeArray();
                for (var e = 0; e < h.fields.length; e++) {
                    var c = ijQuery('input[name="' + h.fields[e].name + '"]');
                    h.fields[e].type = c.hasClass("hidden-checkbox") ? "checkbox" : c.attr("type")
                }
                var b = ijQuery(f).height();
                ijQuery(f).css("height", b + "px");
                ijQuery(f).fadeTo("slow", 1);
                if (!g) {
                    var g = 1
                }
                h.version = window.__version;
                h.variant = window.__variant;
                h.preview = window.__preview;
                if (__instapage_proxy_services !== "PROXY_SERVICES") {
                    __instapage_services = __instapage_proxy_services
                }
                ijQuery.ajax({url: __instapage_services + "/api/email/" + window.__page_id, data: h, type: "post", dataType: "json", success: function (k) {
                    if (!k || k.error) {
                        ijQuery(".notification .loading").hide();
                        ijQuery(".notification .close-button").show().click(function () {
                            closeDim()
                        });
                        ijQuery(".notification .message").html(k && k.error_message ? _Translate.get(k.error_message) : _Translate.get("Something went wrong, message not sent."));
                        return false
                    } else {
                        var l = ijQuery(f).find("input[name=redirect]").val();
                        ijQuery(f).find("input").each(function () {
                            if (!ijQuery(this).hasClass("submit-button") && !ijQuery(this).hasClass("configuration")) {
                                ijQuery(this).val("")
                            }
                        });
                        var i = a ? base64_decode(a) : false;
                        var j = i ? i : _Translate.get("Thank You!<br />Your Message Has been Sent.");
                        if (j) {
                            ijQuery(".notification .loading").hide();
                            ijQuery(".notification .message").html(j)
                        }
                        if (l && l.length > 0) {
                            if (k.response.submission) {
                                if (l.indexOf("?") == -1) {
                                    l += "?"
                                } else {
                                    l += "&"
                                }
                                l += "submission=" + k.response.submission
                            }
                            if (i) {
                                setTimeout(function () {
                                    window.location = l;
                                    setTimeout(function () {
                                        ijQuery(".notification").hide()
                                    }, 10000)
                                }, 3000)
                            } else {
                                window.location = l
                            }
                        } else {
                            setTimeout(function () {
                                ijQuery(".notification").hide()
                            }, 3000)
                        }
                    }
                }, error: function () {
                    closeDim()
                }});
                return false
            } catch (d) {
                if (console) {
                    console.log(d)
                }
            }
        }})
    });
    ijQuery(".email-form").find('input[type="text"]').click(function () {
        if (ijQuery(this).val() == ijQuery(this).attr("default_value")) {
            ijQuery(this).val("")
        }
    }).focusout(function () {
        if (ijQuery(this).val() == "") {
            ijQuery(this).val(ijQuery(this).attr("default_value"))
        }
    });
    ijQuery(".email-form").find('input[type="checkbox"]').change(function () {
        ijQuery("#hidden-" + ijQuery(this).attr("id")).val(ijQuery(this).is(":checked") ? "yes" : "no")
    });
    ijQuery("a").click(function () {
        var b = this;

        function a() {
            ijQuery.ajax({url: __instapage_services + "/ajax/stats/conversion/" + window.__page_id + "/" + window.__version + "/" + window.__variant + "/", data: {type: "link", link: $(b).attr("href")}, type: "post", dataType: "json"})
        }

        if (window.__preview) {
            return true
        }
        if ($(b).attr("target") == "_blank") {
            a()
        } else {
            $(window).unload(function () {
                a()
            })
        }
        return true
    })
});
function closeDim() {
    ijQuery(".notification").hide()
};