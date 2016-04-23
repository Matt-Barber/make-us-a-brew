(function($, window, document, picker, table) {
    $(function() {

        // Standard modal_config
        var modal_config = {dismissable: true, opacity: .5, in_duration: 300, out_duration: 300},
            // an array of drinkers - for testing (can be removed from live)
            test_drinkers = [];
        /**
         * Scan a form and return an obj of names and values (inputs)
         * @param string  form_id
         *
         * @return obj
        **/
        function scan_form(form_id) {
            var form = document.getElementById(form_id),
                elem = form.elements,
                attr = {};
            for (var i = 0; i < elem.length; i++ ) {
                if (elem[i].type !== 'submit') {
                    attr[elem[i].name] = elem[i].value;
                    elem[i].value = '';
                }
            }
            return attr;
        }
        /**
         Performs a CORS ajax request
         * @param string  url       Where to send the request to
         * @param string  method    HTTP Request verb
         * @param func    callback  Successful callback with xhr obj
         * @param func    errback   Error callback with xhr obj
         *
         * @return null
        **/
        function xdr(url, method, data, callback, errback) {
            // feature detection for cors
            if (XMLHttpRequest) {
              var req = new XMLHttpRequest();
              // feature detection for cors (as spec'd by mozilla)
              if ('withCredentials' in req) {
                  if (method === 'GET') {
                      url += '?';
                      Object.keys(data).forEach(function (key, index) {
                          url += key + '=' + data[key] + '&';
                      });
                      url = url.slice(0, url.length-1);
                      data = {};
                  }
                  req.open(method, url, true);
                  req.onerror = errback;
                  req.onreadystatechange = function() {
                      if (req.readyState === 4) {
                          if (req.status >= 200 && req.status < 400) {
                            callback(JSON.parse(req.responseText));
                          } else {
                            errback(new Error(JSON.parse(req)));
                          }
                      }
                  };
                  req.send(data);
              }

            } else if(XDomainRequest) {
              var req = new XDomainRequest();
              req.open(method, url);
              req.onerror = errback;
              req.onload = function() {
                  callback(JSON.parse(req.responseText));
              };
              req.send(data);
            }
        }
        // Add a bunch of test data
        test_drinkers.push({'name': 'Foo', 'drink': 'tea', 'milk': true, 'sugar': 0});
        test_drinkers.push({'name': 'Bar', 'drink': 'coffee', 'milk': true, 'sugar': 1});

        // create a table - and populate with the test data
        document.getElementById('current-drinkers').appendChild(
            table.create_table('current-drinkers', test_drinkers, 'bordered highlight')
        );
        // add the test drinkers to the picker
        test_drinkers.forEach(function (t_d, idx) {
            picker.addDrinker(t_d);
        });
        // lets grab some dom objects we'll need to play with
        var slc_btn = document.getElementById('selector_btn');
            add_btn = document.getElementById('add_btn'),
            del_btn = document.getElementById('delete_btn'),
            add_form = document.getElementById('add_form_data'),
            del_form = document.getElementById('remove_form_data'),
            // some cheeky tags to make giphy a little more unpredictable
            api_tags = ['caffeine', 'coffee', 'tea', 'brew'];

        /**
          OnClick open the add drinker modal.
          We have to reset the select options placeholder each time
          As disabled elements lose their positioning - a bit odd
        **/
        add_btn.onclick = function() {
            var drinks_list = document.getElementsByName('drink'),
                milk_list = document.getElementsByName('milk');
            drinks_list[0].options[0].selected = true;
            milk_list[0].options[0].selected = true;
            $('#add_form').openModal(modal_config);
        };
        /**
          A submit handler for adding a new drinker
          This scans the form for inputs as a dictionary
          Sends this to the addDrinker method and adds a row to a given table
          We can then close the modal and prevent default - no refreshing for this!
        **/
        add_form.addEventListener('submit', function(e){
            var attr = scan_form('add_form_data');
            picker.addDrinker(attr);
            table.add_row(document.getElementById('current-drinkers-table'), attr);
            $('#add_form').closeModal();
            e.preventDefault();
        }, false);

        /**
          OnClick open the remove drinker modal.
          We build the remove drinkers from the remaining drinkers in the pot
          We also have to remove all the previous values in this option, which we can sneakily
          do by setting the options length to 1 - cleanest option by far!
        **/
        del_btn.onclick = function() {
            // build the content of the form in the modal
            var list = document.getElementById('remove_name');
            list.options.length = 1; // remove all items except the top most
            list.options[0].selected = true;

            picker.getRemainingDrinkers().forEach(function (maker, index) {
                var opt = document.createElement('option');
                opt.value = maker;
                opt.textContent = maker;
                list.appendChild(opt);
            }, false);
            $('#remove_form').openModal(modal_config);
        };
        /**
          Essentially the same and inverse of the add event listener
          Could probably refactor into a single reusable function.
        **/
        del_form.addEventListener('submit', function(e) {
            var attr = scan_form('remove_form_data');
            picker.removeDrinker(attr.name);
            table.remove_row(document.getElementById('current-drinkers-table'), attr.name);
            $('#remove_form').closeModal();
            e.preventDefault();
        }, false);

        /**
          The onclick for the Selector does a lot of processing
          First it has to build the modal, including reassigning the onclick
          functions for the two can and can't buttons. It also makes a CORS request
          to the giphy API to get a random caffeine based image
        **/
        slc_btn.onclick = function() {
            // On click, get a maker, and all the things we are going to populate
            var maker = picker.getMaker(),
                selector = document.getElementById('selector'),
                slt_head = document.getElementById('slt_head'),
                slt_content = document.getElementById('slt_content'),
                heading = document.createElement('h5'),
                progress = document.createElement('div'),
                bar = document.createElement('div'),
                can_make_btn = document.getElementById('can_make'),
                cant_make_btn = document.getElementById('cannot_make');
            //clear any content from the modal
            slt_content.innerHTML = '';
            slt_head.innerHTML = '';
            // set the heading for the modal
            heading.innerHTML = maker.charAt(0).toUpperCase() + maker.slice(1);
            slt_head.appendChild(heading);
            // add a progess bar to the modal - while we wait for the ajax
            progress.setAttribute('class', 'progress')
            bar.setAttribute('class', 'indeterminate');
            progress.appendChild(bar);
            slt_content.appendChild(progress);

            xdr(
                'http://api.giphy.com/v1/gifs/random',
                'GET',
                {
                  // global public key provided by giphy - will make this private when the back end is online.
                  api_key: 'dc6zaTOxFJmzC',
                  tag: api_tags[Math.floor(Math.random() * api_tags.length)]
                },
                function(data){
                    var img = document.createElement('img');
                    img.setAttribute('class', 'responsive-img');
                    img.style.minWidth = '400px';
                    img.style.maxWidth = '400px';
                    img.src = data['data']['image_url'];
                    slt_content.innerHTML = '';
                    slt_content.appendChild(img);
                },
                function(data){
                    console.log(data);
                }
            );
            can_make_btn.onclick = function() {
                picker.drinkerCan(maker);
                table.highlight_row(document.getElementById('current-drinkers-table'), maker);
            };
            cant_make_btn.onclick = function() {
                picker.drinkerCant(maker);
            };
            // once we're done - open the modal
            $('#selector').openModal(modal_config);
        };
    });
}(window.jQuery, window, document, new picker(), new table()));
// The global jQuery object is passed as a parameter, unfortuantely we need this for the openModal and close Modal - at least for now.
