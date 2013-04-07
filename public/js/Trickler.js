;
(function ($) {
    $.trickler = function (el, options) {

        var plugin = this;
        var defaults = {
            row: $('<div class="tricklerRow"></div>'),
            list: $('<ul></ul>'),
            cell: $('<li></li>'),
            addNewRow: function () {},
            addClickEvents: function($row) {}
        };

        plugin.settings = {

        };

        var template;
        var init = function () {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;
            plugin.centering = false;
            template = new Template();
        };

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
            $newRow.hide();
            plugin.el.append($newRow);
            $newRow.fadeIn();
            plugin.el.scrollTop(plugin.el.scrollTop()+200);

            mouseWheelEvents($newRow);
            addClickEvents($newRow);
        };

        function mouseWheelEvents($element) {

            var $list = $element.find('ul');

            $element.on('mousewheel', function (event, delta) {
                event.preventDefault();

                if ( plugin.centering ) return;

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

        function centerRow($row, $selectedCell)
        {
            plugin.centering = true;
            var $container = $row.parent().parent();
            var width = $container.width();
            var selectedWidth = $selectedCell.width();
            console.log(width, selectedWidth);
            var midPoint = width/2;
            var offset = -(selectedWidth/2);

            $selectedCell.position();
            console.log(midPoint + offset - $selectedCell.position().left, $selectedCell.position());
            $row.parent().scrollLeft(midPoint + offset - $selectedCell.position().left);
            plugin.centering = false;
        }

        function handleAssetResetClick() {
            var $row = $(this).parent().parent();
            $row.nextUntil().fadeOut().remove();
            assetClick($(this));
        }

        function handleAssetClick () {
            assetClick($(this))
        }

        function assetClick(e)
        {
            e.parent().children().removeClass('trickler-selected').addClass('faded');
            e.addClass('trickler-selected').removeClass('faded');
            plugin.settings.addNewRow();
            e.parent().find('li').off('click').on('click', handleAssetResetClick);
        }

        function addClickEvents($element) {
            $element.find('li').on('click', handleAssetClick);
            plugin.settings.addClickEvents($element);
        }

        init();
//        plugin.addNewRow();
        return plugin;
    }
})(jQuery);
