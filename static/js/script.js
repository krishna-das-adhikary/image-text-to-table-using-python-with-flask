$(document).ready(function () {
    const $resultData = $("#result-data");
    $(".drop-zone__input").each(function () {
        let $inputElement = $(this);
        let $dropZoneElement = $inputElement.closest(".drop-zone");

        $dropZoneElement.on("click", function () {
            $inputElement.click();
        });

        $inputElement.on("change", function () {
            if (this.files.length) {
                updateThumbnail($dropZoneElement, this.files[0]);
            }
        });

        $dropZoneElement.on("dragover", function (e) {
            e.preventDefault();
            $dropZoneElement.addClass("drop-zone--over");
        });

        $dropZoneElement.on("dragleave dragend", function () {
            $dropZoneElement.removeClass("drop-zone--over");
        });

        $dropZoneElement.on("drop", function (e) {
            e.preventDefault();
            
            if (e.originalEvent.dataTransfer.files.length) {
                $inputElement[0].files = e.originalEvent.dataTransfer.files;
                updateThumbnail($dropZoneElement, e.originalEvent.dataTransfer.files[0]);
            }

            $dropZoneElement.removeClass("drop-zone--over");
        });
    });

    function createTable(data) {
        let tableHTML = '<table border="1" class="table table-style"><tr>';
        for (let i = 0; i < data.length; i++) {
            tableHTML += `<td>${data[i]}</td>`;
            if ((i + 1) % 3 === 0) {
                tableHTML += '</tr><tr>';
            }
        }
        tableHTML += '</tr></table>';
        return tableHTML;
    }

    function updateThumbnail($dropZoneElement, file) {
        let $thumbnailElement = $dropZoneElement.find(".drop-zone__thumb");

        if ($dropZoneElement.find(".drop-zone__prompt").length) {
            $dropZoneElement.find(".drop-zone__prompt").remove();
        }

        if (!$thumbnailElement.length) {
            $thumbnailElement = $("<div class='drop-zone__thumb'></div>");
            $dropZoneElement.append($thumbnailElement);
        }

        $thumbnailElement.attr("data-label", file.name);

        if (file.type.startsWith("image/")) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                $thumbnailElement.css("background-color", "red");
                let loadingImageUrl = "/static/images/uploading.gif";
                $thumbnailElement.css("background-image", `url('${loadingImageUrl}')`);
            };

            // File upload from ajax code
            let formData = new FormData();
            formData.append("file", file);

            $.ajax({
              url: "/upload",
              type: "POST",
              data: formData,
              contentType: false,
              processData: false,
              success: function (response) {
                console.log(response)
                if (response.error) {
                  $resultData.html(`<p class="text-danger">${response.error}</p>`);
                    console.log(response.error);
                } else {
                    $resultData.html(createTable(response.message));
                    $thumbnailElement.css("background-image", `url('${reader.result}')`);
                    console.log(response.message);
                }
              },
              error: function () {
                $resultData.html('<p class="text-danger">Upload failed. Please try again.</p>');
                console.log('Upload failed. Please try again.');
              },
            });
            //./File upload from ajax code
        } else {
            $thumbnailElement.css("background-image", "none");
        }
    }
});
