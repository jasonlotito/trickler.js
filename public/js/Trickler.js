;
(function ($) {
    $.trickler = function (el, options) {

        var plugin = this;
        var defaults = {
            row: $('<div class="tricklerRow"></div>'),
            list: $('<ul></ul>'),
            cell: $('<li></li>'),
            addNewRow: function () {
            }
        };

        plugin.settings = {

        };

        var template;
        var init = function () {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;
            template = new Template();
        };

        var tricklerRow = '<div class="tricklerRow"><ul><li><img src="img/photos/1.jpg" alt=""/></li><li><img src="img/photos/2.jpg" alt=""/></li><li><img src="img/photos/3.jpg" alt=""/></li><li><img src="img/photos/4.jpg" alt=""/></li><li><img src="img/photos/5.jpg" alt=""/></li><li><img src="img/photos/6.jpg" alt=""/></li><li><img src="img/photos/7.jpg" alt=""/></li><li><img src="img/photos/8.jpg" alt=""/></li><li><img src="img/photos/9.jpg" alt=""/></li><li><img src="img/photos/10.jpg" alt=""/></li><li><img src="img/photos/11.jpg" alt=""/></li></ul></div>';
        var $row = $(tricklerRow);

        var ALT = 18;
        var trickler = el;

        // God, I hate this!!!
        function Template() {
            this.renderRow = function (cellDataList) {
                var $row = plugin.settings.row.clone();
                var $list = plugin.settings.list.clone();
                var $cell = plugin.settings.cell.clone();

                for (var x in cellDataList) {
                    if (cellDataList.hasOwnProperty(x)) {
                        var elementHtml = cellDataList[x];
                        var $newCell = $cell.clone();
                        $newCell.html(elementHtml);
                        $list.append($newCell);
                    }
                }

                var $newRow = $row.clone();
                $newRow.append($list);
                return $newRow;
            }
        }

        var MouseEvents = (function () {
            var MouseEvents = {
                altPressed: false
            };

            $(window).on('keydown', function (e) {
                if (e.keyCode === ALT) {
                    MouseEvents.altPressed = true;
                }
            });

            $(window).on('keyup', function (e) {
                if (e.keyCode === ALT) {
                    MouseEvents.altPressed = false;
                }
            });

            return MouseEvents;
        })();

        plugin.addNewRow = function (data) {
            var $newRow = template.renderRow(data)
            $("#trickler").append($newRow);
            mouseWheelEvents($newRow);
            addClickEvents($newRow);
        };

        function mouseWheelEvents($element) {

            var $list = $element.find('ul');

            $element.on('mousewheel', function (event, delta) {
                event.preventDefault();

                if (MouseEvents.altPressed) {
                    this.scrollLeft -= (delta * 30);

                    var $firstElement = $($list.find('li:first-child')[0]);
                    var $secondElement = $($list.find('li:nth-child(2)')[0]);
                    var $thirdElement = $($list.find('li:nth-child(3)')[0]);
                    var $lastElement = $($list.find('li:last-child')[0]);

                    if (this.scrollLeft > $firstElement.width() + $secondElement.width() + $thirdElement.width()) {
                        $list.append($firstElement);
                        $element[0].scrollLeft -= $firstElement.width();
                    } else if (this.scrollLeft < $firstElement.width()) {
                        $list.prepend($lastElement);
                        $element[0].scrollLeft += $lastElement.width();
                    }
                } else {
                    document.getElementById('trickler').scrollTop -= (delta * 30);
                }
            });

            var $lastFirstElement = $($list.find('li:last')[0]);
            $list.prepend($lastFirstElement);
            var $workingImage = $lastFirstElement.find('img');

            $workingImage.imagesLoaded(function () {
                var sleft = $(this).width();
                $element[0].scrollLeft = sleft;
            });
        }

        function addClickEvents($element) {
            $element.find('li').on('click', function () {
                $(this).addClass('trickler-selected');
                plugin.settings.addNewRow();
                $element.find('li').off('click');
            });
        }

        init();
//        plugin.addNewRow();
        return plugin;
    }
})(jQuery);
