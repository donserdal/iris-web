const preventFormDefaultBehaviourOnSubmit = (event) => {
    event.preventDefault();
    return false;
};

function add_customer() {
    const url = 'customers/add/modal' + case_param();
    $('#modal_add_customer_content').load(url, function (response, status, xhr) {
        if (status !== "success") {
             ajax_notify_error(xhr, url);
             return false;
        }
        $('#form_new_customer').on("submit", preventFormDefaultBehaviourOnSubmit);
        $('#submit_new_customer').on("click", function () {
            const form = $('#form_new_customer').serializeObject();

            ret = get_custom_attributes_fields();
            has_error = ret[0].length > 0;
            attributes = ret[1];

            if (has_error){return false;}

            form['custom_attributes'] = attributes;

            post_request_api('customers/add', JSON.stringify(form), true)
            .done((data) => {
                 if(notify_auto_api(data)) {
                    refresh_customer_table();
                    $('#modal_add_customer').modal('hide');
                 }
            });

            return false;
        })
    });
    $('#modal_add_customer').modal({show: true});
}

$('#customers_table').dataTable({
        "ajax": {
            "url": "customers/list" + case_param(),
            "contentType": "application/json",
            "type": "GET",
            "data": function (d) {
                if (d.status == 'success') {
                    return JSON.stringify(d.data);
                } else {
                    return [];
                }
            }
        },
        "order": [[0, "desc"]],
        "autoWidth": false,
        "columns": [
            {
                "data": "customer_name",
                "render": function (data, type, row) {
                    data = sanitizeHTML(data);
                    return '<a href="#" onclick="customer_detail(\'' + row['customer_id'] + '\');">' + data + '</a>';
                }
            }
        ]
    }
);

function refresh_customer_table(do_notify) {
    $('#customers_table').DataTable().ajax.reload();
    if (do_notify !== undefined) {
        notify_success("Refreshed");
    }
}


/* Fetch the details of an asset and allow modification */
function customer_detail(customer_id) {
    url = 'customers/update/' + customer_id + '/modal' + case_param();
    $('#modal_add_customer_content').load(url, function (response, status, xhr) {
        if (status !== "success") {
             ajax_notify_error(xhr, url);
             return false;
        }

        $('#form_new_customer').on("submit", preventFormDefaultBehaviourOnSubmit);
        $('#submit_new_customer').on("click", function () {

            const form = $('#form_new_customer').serializeObject();
            ret = get_custom_attributes_fields();
            has_error = ret[0].length > 0;
            attributes = ret[1];

            if (has_error){return false;}

            form['custom_attributes'] = attributes;

            post_request_api('customers/update/' + customer_id, JSON.stringify(form), true)
            .done((data) => {
                if(notify_auto_api(data)) {
                    refresh_customer_table();
                    $('#modal_add_customer').modal('hide');
                }
            });

            return false;
        })


    });
    $('#modal_add_customer').modal({show: true});
}

function delete_customer(id) {
    swal({
        title: "Are you sure ?",
        text: "You won't be able to revert this !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    .then((willDelete) => {
        if (willDelete) {
            get_request_api('/manage/customers/delete/' + id)
            .done((data) => {
                if(notify_auto_api(data)) {
                    refresh_customer_table();
                    $('#modal_add_customer').modal('hide');
                }
            });
        } else {
            swal("Pfew, that's was close");
        }
    });
}