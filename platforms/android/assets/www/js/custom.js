var app = {
	initialize: function() {
		console.log("start app initialize");
		window.pages = {};
		window.pages.welcome = new WelcomePage();
		window.pages.welcome.render();
	},
};

var Book = Backbone.Model.extend({
	parse: function(response, options) {
		return response.Item;
	},
});

var Books = Backbone.Collection.extend({
	model: Book,
	setKeyword: function(keyword) {
		this.keyword = keyword;
	},
	url: function() {
		keyword = encodeURI(this.keyword);
		applicationId = "a9923edaf73bacf7b4b56248e6bd3064";
		return "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&keyword=" + keyword + "&applicationId=" + applicationId;
	},
	parse: function(response) {
		return response.Items;
	},
});

var WelcomePage = Backbone.View.extend({
	el: "#page-welcome",
	events: {
		"click #link-toybox": "clickLinkToybox",
	},
	initialize: function() {
		console.log("start initialize");
	},
	render: function() {
		console.log("start render");
	},
	clickLinkToybox: function() {
		if (typeof window.pages.toyboxPage === "undefined") {
			window.pages.toyboxPage = new ToyboxPage();
		}
		window.pages.toyboxPage.render();
		$.mobile.changePage("#page-toybox");
	},
});

var ToyboxPage = Backbone.View.extend({
	el: "#page-toybox",
	events: {
		"click #pt-btn-get-device-info": "clickBtnGetDeviceInfo",
		"click #pt-btn-get-picture": "clickBtnGetPicture",
		"click #pt-btn-storage-save": "clickBtnStorageSave",
		"click #pt-btn-search-books": "clickBtnSearchBooks",
	},
	initialize: function() {
		console.log("start initialize");
	},
	render: function() {
		console.log("start render");
		$("#pt-tab-storage-text").val(localStorage.getItem("text"));
		$("#pt-tab-book-list").empty();
	},
	clickBtnGetDeviceInfo: function() {
		console.log("start clickBtnGetDeviceInfo");
		$("#pt-tab-device-model").val(device.model);
		$("#pt-tab-device-cordova").val(device.cordova);
		$("#pt-tab-device-platform").val(device.platform);
		$("#pt-tab-device-uuid").val(device.uuid);
		$("#pt-tab-device-version").val(device.version);
		$("#pt-tab-device-name").val(device.name);
	},
	clickBtnGetPicture: function() {
		console.log("start clickBtnGetPicture");
		$.mobile.loading("show");
		navigator.camera.getPicture(function(imageUri) {
			console.log("getPicture success : " + imageUri);
			$("#pt-camera-image").attr("src", imageUri);
			$.mobile.loading("hide");
		}, function(message) {
			$.mobile.loading("hide");
			alert(message);
		}, {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			saveToPhotoAlbum: false,
			targetWidth: 500,
			targetHeight: 500,
		});
	},
	clickBtnStorageSave: function() {
		console.log("start clickBtnStorageSave");
		localStorage.setItem("text", $("#pt-tab-storage-text").val());
		$("#pt-popup-message").empty().html("Saved.");
		$("#pt-popup").popup("open");
	},
	clickBtnSearchBooks: function() {
		console.log("start clickBtnSearchBooks");
		$("#pt-tab-book-list").empty();
		keyword = $("#pt-tab-books-keyword").val();
		books = new Books();
		books.setKeyword(keyword);
		books.fetch().done(function() {
			console.log("found books: " + books.length + "items");
			books.each(function(book) {
				$("#pt-tab-book-list").append(_.template($("#template-book-list-item").text(), {
					cid: book.cid,
					title: book.get("title"),
				}));
			});
			$("#pt-tab-book-list").listview("refresh");
		}).fail(function() {
			$("#pt-popup-message").empty().html("Search Failed.");
			$("#pt-popup").popup("open");
		});
	},
});
