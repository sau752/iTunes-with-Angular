(function () {

    angular.module('artistApp', []).
        config(function ($routeProvider) {
            $routeProvider.
                when('/', { controller: searchArtistCtrl, templateUrl: 'searchartist.html' }).
                when('/details', { controller: listArtistCtrl, templateUrl: 'artistdetail.html' }).
                otherwise({ redirectTo: '/' });
        }).
        service('Artists', function () {
            this.artists = "";
        });

    function searchArtistCtrl($scope, $http, $location, Artists) {

        $scope.artistname = "";
        $scope.trackcount = "";

        $scope.fetchArtist = function () {

            var artistName = $scope.artistname;
            var tracksCount = $scope.trackcount > 4 ? 4 : $scope.trackcount;
            var artistURL = "http://itunes.apple.com/search?term=" + artistName + "&limit=" + tracksCount + "&callback=JSON_CALLBACK";

            $http({
                method: 'JSONP',
                url: artistURL,
                responseType: "json"
            }).success(function (data) {
                $('#myModal').modal('hide');
                Artists.artists = data.results;
                $location.path("/details");
            }).error(function (data, status) {
                $scope.names = "Request failed";
            });
        }
    }

    function listArtistCtrl($scope, Artists, $http) {

        $scope.iTunesArtist = Artists;
        $scope.wellContainer = 0;
        console.log($scope.iTunesArtist);
        $scope.getArtistData = function (artist) {
            $scope.trackId = artist.trackId;

            var artistURL = "http://itunes.apple.com/search?term=" + artist.artistName + "&limit=1&callback=JSON_CALLBACK";
            
            $http({
                method: 'JSONP',
                url: artistURL,
                responseType: "json"
            }).success(function (data) {
                $scope.wellContainer = 1;
                var result = data.results[0];
                $scope.navArtist = typeof result !== "undefined" ? result.artistName : 'N/A';
                $scope.navTrack = typeof result !== "undefined" ? result.trackName : 'N/A';
                $scope.imageURL = typeof result !== "undefined" ? result.artworkUrl30 : "N/A";
            }).error(function (data, status) {
                $scope.names = "Request failed";
            });
        }
    }

})();
